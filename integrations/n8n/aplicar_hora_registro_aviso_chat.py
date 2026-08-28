#!/usr/bin/env python3
"""Hora exacta de registro en Twenty + aviso a Google Chat.

Ricardo, 28-ago-2026: el `createdAt` de sistema de la Opportunity se muestra
como «hace 3 horas» (`displayFormat: RELATIVE`) y Twenty responde 403 si se
intenta cambiarlo. El negocio tiene el campo custom `horaRegistro` (DATE_TIME,
label «Hora de registro») con el mismo formato absoluto que Fecha demo.
n8n lo escribe al CREAR el negocio y lo PISA cuando el mismo lead vuelve a
enviar el formulario (Instant Form o paso 3 del wizard), para que reaparezca
en «Leads del día» con una nota «Ya había cotizado». Un agendamiento (Meet
o booking_confirmed) no lo pisa: agendar no es recotizar.

Al mismo tiempo, cada lead nuevo y cada agendamiento avisan al espacio de
Google Chat que ya usa el Wizard (`spaces/AAQAY5jOsuA`):

- Instant Form → Sub A, en paralelo a CAPI.
- Paso 3 de /agenda o /ventas → Wizard, desde «Solo etapa de contacto»
  (inmediato; ya no espera 60 s).
- Meet creado → este workflow, después de «Crear Evento + Meet».

El webhook se CLONA del nodo vivo «Notify Google Chat» del Wizard. No se
escribe en disco ni se imprime: el repo es público.

Idempotente. Requiere N8N_API_KEY. El campo y las columnas de Twenty ya
están en crm.oacg.cl; este script no los recrea.

También reata el wait de 60 s → Clinera @744 si se cortó al recablear Chat
fuera de esa cadena (el wait ya no alimenta Chat).
"""
from __future__ import annotations

import json
import os
import sys
import time
import uuid
import urllib.error
import urllib.request

BASE = os.environ.get("N8N_BASE", "https://n8n.oacg.cl/api/v1")
KEY = os.environ.get("N8N_API_KEY", "")

SUB_A = "YmauqyDqrZNKIYlg"
WIZARD = "A3wOPmhQjit8VswM"
MEET = "FZvyK42lkQdKWcIl"

HORA_NEGOCIO = (
    "        if (!negocio.horaRegistro) "
    "negocio.horaRegistro = new Date().toISOString();\n"
)
ANCLA_CREAR = "        if (companyId) negocio.companyId = companyId;\n"

HORA_MEET = (
    "    if (!negocioNuevo.horaRegistro) "
    "negocioNuevo.horaRegistro = new Date().toISOString();\n"
)
ANCLA_MEET = (
    "    if (patch.enlaceDemo) negocioNuevo.enlaceDemo = patch.enlaceDemo;\n"
)

# Refresh: el lead VOLVIÓ a enviar el formulario.
ANCLA_ANTES_PATCH = (
    "        if ((ORDEN[abierta.stage] ?? 0) < ORDEN[etapaDestino]) "
    "refresco.stage = etapaDestino;\n"
    "        await api('PATCH', `/rest/opportunities/${abierta.id}`, refresco);\n"
)
HORA_ANTES_PATCH = (
    "        if ((ORDEN[abierta.stage] ?? 0) < ORDEN[etapaDestino]) "
    "refresco.stage = etapaDestino;\n"
    "        if (String(d.booking_status || '').trim().toLowerCase() !== 'confirmed') {\n"
    "          refresco.horaRegistro = new Date().toISOString();\n"
    "          refresco.notas = '🔁 Ya había cotizado';\n"
    "        }\n"
    "        await api('PATCH', `/rest/opportunities/${abierta.id}`, refresco);\n"
)
ANCLA_HORA_NOTAS = (
    "          refresco.horaRegistro = new Date().toISOString();\n"
    "        }\n"
)
HORA_CON_NOTAS_TEXTO = (
    "          refresco.horaRegistro = new Date().toISOString();\n"
    "          refresco.notas = '🔁 Ya había cotizado';\n"
    "        }\n"
)
ANCLA_NOTA_CREAR_FIN = (
    "            resultado.twenty.notaRecotizo = recotizo;\n"
    "          } catch (e) { /* la nota no debe tumbar el alta */ }\n"
    "        }\n"
    "      }\n"
    "    }\n\n"
)
PATCH_NOTAS_AL_CREAR = (
    "            resultado.twenty.notaRecotizo = recotizo;\n"
    "          } catch (e) { /* la nota no debe tumbar el alta */ }\n"
    "        }\n"
    "        if (typeof personaYaExistia !== 'undefined' && personaYaExistia && resultado.twenty.opportunityId) {\n"
    "          try {\n"
    "            await api('PATCH', '/rest/opportunities/' + resultado.twenty.opportunityId, {\n"
    "              notas: '🔁 Ya había cotizado',\n"
    "            });\n"
    "          } catch (e) { /* el texto de la columna no debe tumbar el alta */ }\n"
    "        }\n"
    "      }\n"
    "    }\n\n"
)

ANCLA_NOTA = (
    "        resultado.twenty.opportunityRefrescada = true;\n"
    "      } else {\n"
)
NOTA_RECOTIZO = """        resultado.twenty.opportunityRefrescada = true;
        if (refresco.horaRegistro) {
          const previa = abierta.horaRegistro || abierta.createdAt;
          const fmt = (iso) => {
            try {
              return new Intl.DateTimeFormat('es-CL', {
                timeZone: 'America/Santiago',
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(iso));
            } catch (e) { return String(iso || ''); }
          };
          try {
            const recotizo = crear(await api('POST', '/rest/notes?disableDuplicateCheck=true', {
              title: '🔁 Ya había cotizado',
              bodyV2: { markdown:
                '**Ya había cotizado** · volvió a enviar el formulario.\\n' +
                (previa ? '- **Envío anterior:** ' + fmt(previa) + '\\n' : '') +
                '- **Este envío:** ' + fmt(refresco.horaRegistro) + '\\n'
              },
            }));
            if (recotizo && abierta.id) {
              try {
                await api('POST', '/rest/noteTargets?disableDuplicateCheck=true', {
                  noteId: recotizo,
                  targetOpportunityId: abierta.id,
                });
              } catch (e2) {
                if (personId) {
                  await api('POST', '/rest/noteTargets?disableDuplicateCheck=true', {
                    noteId: recotizo,
                    targetPersonId: personId,
                  });
                }
              }
            }
            resultado.twenty.notaRecotizo = recotizo;
          } catch (e) { /* la nota no debe tumbar el PATCH */ }
        }
      } else {
"""

ANCLA_PERSONA = "    if (!personId) {\n      const persona = {\n"
PHONE_LOOKUP = """    if (!personId && d.phone) {
      const ccTelBusca = PREFIJO[d.country] || '';
      const brutoBusca = String(d.phone).replace(/\\D/g, '');
      const nacionalBusca = ccTelBusca && brutoBusca.startsWith(ccTelBusca.slice(1))
        ? brutoBusca.slice(ccTelBusca.length - 1)
        : brutoBusca;
      if (nacionalBusca) {
        const porTel = primero(
          await api('GET', `/rest/people?filter=phones.primaryPhoneNumber%5Beq%5D:${encodeURIComponent(nacionalBusca)}&limit=1`),
          'people'
        );
        if (porTel) personId = porTel.id;
      }
    }

    const personaYaExistia = !!personId;

    if (!personId) {
      const persona = {
"""

ANCLA_NUEVA = "        resultado.twenty.opportunityNueva = true;\n      }\n    }\n\n"
VERIFY_NUEVA = """        if (resultado.twenty.opportunityId) {
          try {
            await api('GET', '/rest/opportunities/' + resultado.twenty.opportunityId);
          } catch (e) {
            resultado.twenty.opportunityId = crear(
              await api('POST', '/rest/opportunities?disableDuplicateCheck=true', negocio)
            );
            resultado.twenty.opportunityReintentada = true;
          }
        }
        resultado.twenty.opportunityNueva = true;
      }
    }

"""
ANCLA_YA_EXISTIA = (
    "        if (porTel) personId = porTel.id;\n"
    "      }\n"
    "    }\n\n"
    "    if (!personId) {\n"
    "      const persona = {\n"
)
YA_EXISTIA = (
    "        if (porTel) personId = porTel.id;\n"
    "      }\n"
    "    }\n\n"
    "    const personaYaExistia = !!personId;\n\n"
    "    if (!personId) {\n"
    "      const persona = {\n"
)
NOTA_AL_CREAR = """        resultado.twenty.opportunityNueva = true;
        if (typeof personaYaExistia !== 'undefined' && personaYaExistia && resultado.twenty.opportunityId) {
          const fmt = (iso) => {
            try {
              return new Intl.DateTimeFormat('es-CL', {
                timeZone: 'America/Santiago',
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(iso));
            } catch (e) { return String(iso || ''); }
          };
          try {
            const ahora = (negocio && negocio.horaRegistro) || new Date().toISOString();
            const recotizo = crear(await api('POST', '/rest/notes?disableDuplicateCheck=true', {
              title: '🔁 Ya había cotizado',
              bodyV2: { markdown:
                '**Ya había cotizado** · volvió a enviar el formulario.\\n' +
                '- **Este envío:** ' + fmt(ahora) + '\\n'
              },
            }));
            if (recotizo) {
              try {
                await api('POST', '/rest/noteTargets?disableDuplicateCheck=true', {
                  noteId: recotizo,
                  targetOpportunityId: resultado.twenty.opportunityId,
                });
              } catch (e2) {
                if (personId) {
                  await api('POST', '/rest/noteTargets?disableDuplicateCheck=true', {
                    noteId: recotizo,
                    targetPersonId: personId,
                  });
                }
              }
            }
            resultado.twenty.notaRecotizo = recotizo;
          } catch (e) { /* la nota no debe tumbar el alta */ }
        }
        if (typeof personaYaExistia !== 'undefined' && personaYaExistia && resultado.twenty.opportunityId) {
          try {
            await api('PATCH', '/rest/opportunities/' + resultado.twenty.opportunityId, {
              notas: '🔁 Ya había cotizado',
            });
          } catch (e) { /* el texto de la columna no debe tumbar el alta */ }
        }
      }
    }

"""
VISTA_LEADS_DIA = "ea158c82-c823-403b-91ac-7c3240815525"
VISTA_TODAS = "3961d7e5-9c0d-490f-8c00-371698ab4d33"
CAMPO_HORA_REGISTRO = "ccc038cb-b161-4c94-a625-24289b63d266"
CAMPO_CREATED_AT = "6921350c-ee3c-46e9-a541-70130b735229"
CAMPO_SITIO_WEB = "e467105f-75e9-4319-9c73-a0af9a5f818e"
CAMPO_CIUDAD = "db500c15-0799-4a82-b46b-395d931c1c5b"
CAMPO_CARGO = "f603b699-06b2-4109-a4c5-708d7cdf35c1"
CAMPO_NOTE_TARGETS = "b41470cc-48c4-4f44-87fa-c9ebd35cf05b"
CAMPO_NOTAS = "5ab5df0e-ce01-4bc1-aab3-09e61097da42"
# Instant Form 28-ago 09:32: el POST del negocio 404; se repuso a mano sin nota.
OPP_NOTA_RECOTIZO = "0c202f25-6f46-4c18-9a69-f8caec88fded"
TEXTO_RECOTIZO = "🔁 Ya había cotizado"

SUBA_CHAT_BODY = (
    "={{ JSON.stringify({ text: (() => {\n"
    "  const d = $('Prepare Lead Data').first().json || {};\n"
    "  const txt = (v) => String(v == null ? '' : v).trim();\n"
    "  const lineas = [];\n"
    "  lineas.push('🆕 *Nuevo lead · Instant Form de Meta*');\n"
    "  lineas.push('');\n"
    "  lineas.push('*Nombre:* ' + (txt(d.fullName) || 'sin nombre'));\n"
    "  lineas.push('*Email:* ' + (txt(d.emailReal || d.email) || 'sin correo'));\n"
    "  lineas.push('*Teléfono:* ' + (txt(d.phoneRaw || d.phone) || "
    "'sin teléfono') + (d.country ? ' · ' + d.country : ''));\n"
    "  if (txt(d.clinicName)) lineas.push('*Clínica:* ' + txt(d.clinicName));\n"
    "  if (txt(d.rol)) lineas.push('*Cargo:* ' + txt(d.rol));\n"
    "  if (txt(d.tipoClinica)) lineas.push('*Tipo:* ' + txt(d.tipoClinica));\n"
    "  if (txt(d.tamanoOperacionLabel)) "
    "lineas.push('*Volumen:* ' + txt(d.tamanoOperacionLabel));\n"
    "  if (txt(d.necesidadPrincipal)) "
    "lineas.push('*Necesidad:* ' + txt(d.necesidadPrincipal));\n"
    "  if (txt(d.origen)) lineas.push('*Origen:* ' + txt(d.origen));\n"
    "  const cuando = [txt(d.ingresoDate), txt(d.ingresoTime)]"
    ".filter(Boolean).join(' ');\n"
    "  lineas.push('*Registrado:* ' + (cuando || 'ahora') + ' (Chile)');\n"
    "  lineas.push('🗓️ *Demo:* sin hora todavía — rellenó el Instant Form');\n"
    "  return lineas.join('\\n');\n"
    "})() }) }}"
)

MEET_PREP_CODE = """\
const r = $('Normalizar Reserva').first().json || {};
if (r.esPrueba) return [];
const c = r.cliente || {};
const txt = (v) => String(v == null ? '' : v).trim();
const origen = txt(r.origenCita);
const titulo = origen === 'agente-ia'
  ? '📅 *Agendó · agente IA (WhatsApp)*'
  : '📅 *Agendó la demo*';
const lineas = [titulo, ''];
lineas.push('*Nombre:* ' + (txt(c.nombre) || 'sin nombre'));
lineas.push('*Email:* ' + (txt(c.email) || 'sin correo'));
lineas.push('*Teléfono:* ' + (txt(c.telefono) || 'sin teléfono'));
if (txt(r.responsable)) lineas.push('*Con:* ' + txt(r.responsable));
const inicio = txt(r.startISO);
let demo = inicio;
try {
  if (inicio) {
    demo = new Intl.DateTimeFormat('es-CL', {
      timeZone: 'America/Santiago',
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(inicio));
  }
} catch (e) {}
lineas.push('🗓️ *Demo:* ' + (demo || 'sin hora'));
return [{ json: { textoChat: lineas.join('\\n') } }];
"""

CHAT_HTTP_OPTIONS = {
    "timeout": 10000,
    "response": {"response": {"neverError": True}},
}


def api(method: str, path: str, body: dict | None = None) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=None if body is None else json.dumps(body).encode(),
        method=method,
        headers={
            "X-N8N-API-KEY": KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            if not raw:
                return {}
            return json.loads(raw)
    except urllib.error.HTTPError as e:
        detalle = e.read().decode("utf-8", "replace")[:800]
        raise SystemExit(f"{method} {path} → {e.code}: {detalle}") from e


def node(w: dict, name: str) -> dict:
    for n in w["nodes"]:
        if n.get("name") == name:
            return n
    raise SystemExit(f"no está el nodo {name!r} en {w.get('name')}")


def maybe_node(w: dict, name: str) -> dict | None:
    for n in w["nodes"]:
        if n.get("name") == name:
            return n
    return None


def payload_de(w: dict) -> dict:
    out = {
        "name": w["name"],
        "nodes": w["nodes"],
        "connections": w["connections"],
        "settings": w.get("settings") or {},
    }
    if "staticData" in w:
        out["staticData"] = w["staticData"]
    return out


def es_webhook_chat(url: str) -> bool:
    return "chat.googleapis.com" in url and "key=" in url


def webhook_del_wizard(wiz: dict) -> str:
    n = node(wiz, "Notify Google Chat")
    url = str((n.get("parameters") or {}).get("url") or "")
    if not es_webhook_chat(url):
        raise SystemExit(
            "Wizard no tiene webhook de Chat para clonar "
            "(no se versiona; tiene que estar en el nodo vivo)."
        )
    return url


def ensure_edge(
    conns: dict, src: str, dest: str, output_index: int = 0
) -> bool:
    block = conns.setdefault(src, {})
    main = block.setdefault("main", [])
    while len(main) <= output_index:
        main.append([])
    branch = main[output_index]
    if branch is None:
        branch = []
        main[output_index] = branch
    for d in branch:
        if d.get("node") == dest:
            return False
    branch.append({"node": dest, "type": "main", "index": 0})
    return True


def remove_edge(conns: dict, src: str, dest: str) -> bool:
    changed = False
    main = (conns.get(src) or {}).get("main") or []
    for branch in main:
        if not branch:
            continue
        keep = [d for d in branch if d.get("node") != dest]
        if len(keep) != len(branch):
            branch[:] = keep
            changed = True
    return changed


def inject_hora_crear(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if "negocio.horaRegistro" in code:
        return []
    if ANCLA_CREAR not in code:
        raise SystemExit(f"{etiqueta}: no encuentro ancla {ANCLA_CREAR!r}")
    n["parameters"]["jsCode"] = code.replace(ANCLA_CREAR, ANCLA_CREAR + HORA_NEGOCIO, 1)
    return [f"{etiqueta} Twenty: negocio.horaRegistro"]


def inject_hora_refresco(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if "refresco.horaRegistro" in code:
        return []
    if ANCLA_ANTES_PATCH not in code:
        raise SystemExit(f"{etiqueta}: no encuentro ancla del PATCH de refresco")
    n["parameters"]["jsCode"] = code.replace(ANCLA_ANTES_PATCH, HORA_ANTES_PATCH, 1)
    return [f"{etiqueta} Twenty: refresco.horaRegistro"]


def inject_nota_recotizo(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if "Ya había cotizado" in code:
        return []
    if ANCLA_NOTA not in code:
        raise SystemExit(f"{etiqueta}: no encuentro ancla opportunityRefrescada")
    n["parameters"]["jsCode"] = code.replace(ANCLA_NOTA, NOTA_RECOTIZO, 1)
    return [f"{etiqueta} Twenty: nota Ya había cotizado"]


def inject_phone_lookup(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if "phones.primaryPhoneNumber" in code:
        return []
    if ANCLA_PERSONA not in code:
        raise SystemExit(f"{etiqueta}: no encuentro ancla if (!personId)")
    n["parameters"]["jsCode"] = code.replace(ANCLA_PERSONA, PHONE_LOOKUP, 1)
    return [f"{etiqueta} Twenty: busca persona también por teléfono"]


def inject_verify_opp(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if "opportunityReintentada" in code:
        return []
    if ANCLA_NUEVA not in code:
        raise SystemExit(f"{etiqueta}: no encuentro ancla opportunityNueva")
    n["parameters"]["jsCode"] = code.replace(ANCLA_NUEVA, VERIFY_NUEVA, 1)
    return [f"{etiqueta} Twenty: GET tras crear el negocio"]


def inject_persona_ya_existia(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if "personaYaExistia" in code:
        return []
    if ANCLA_YA_EXISTIA not in code:
        raise SystemExit(f"{etiqueta}: no encuentro ancla personaYaExistia")
    n["parameters"]["jsCode"] = code.replace(ANCLA_YA_EXISTIA, YA_EXISTIA, 1)
    return [f"{etiqueta} Twenty: marca personaYaExistia"]


def inject_nota_al_crear(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if "personaYaExistia !== 'undefined'" in code or "personaYaExistia && resultado.twenty.opportunityId" in code:
        return []
    if ANCLA_NUEVA not in code:
        raise SystemExit(f"{etiqueta}: no encuentro ancla opportunityNueva para la nota")
    n["parameters"]["jsCode"] = code.replace(ANCLA_NUEVA, NOTA_AL_CREAR, 1)
    return [f"{etiqueta} Twenty: nota Ya había cotizado también al crear"]


def inject_notas_texto(w: dict, etiqueta: str) -> list[str]:
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    cambios: list[str] = []
    if "refresco.notas" not in code:
        if ANCLA_HORA_NOTAS not in code:
            raise SystemExit(f"{etiqueta}: no encuentro ancla horaRegistro para notas")
        code = code.replace(ANCLA_HORA_NOTAS, HORA_CON_NOTAS_TEXTO, 1)
        cambios.append(f"{etiqueta} Twenty: columna notas al recotizar")
    if "notas: '🔁 Ya había cotizado'" not in code:
        if ANCLA_NOTA_CREAR_FIN in code:
            code = code.replace(ANCLA_NOTA_CREAR_FIN, PATCH_NOTAS_AL_CREAR, 1)
            cambios.append(f"{etiqueta} Twenty: columna notas al crear recotizado")
    n["parameters"]["jsCode"] = code
    return cambios


def inject_hora_meet(w: dict) -> list[str]:
    n = node(w, "Twenty - Agendó (Meet)")
    code = n["parameters"]["jsCode"]
    if "negocioNuevo.horaRegistro" in code:
        return []
    if ANCLA_MEET not in code:
        raise SystemExit("Meet: no encuentro ancla de enlaceDemo")
    n["parameters"]["jsCode"] = code.replace(ANCLA_MEET, ANCLA_MEET + HORA_MEET, 1)
    return ["Meet Twenty: negocioNuevo.horaRegistro"]


def nodo_http_chat(node_id: str, url: str, json_body: str, position: list[int]) -> dict:
    return {
        "parameters": {
            "method": "POST",
            "url": url,
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": json_body,
            "options": CHAT_HTTP_OPTIONS,
        },
        "id": node_id,
        "name": "Notify Google Chat",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": position,
        "onError": "continueRegularOutput",
    }


def ensure_suba_chat(w: dict, url: str) -> list[str]:
    cambios: list[str] = []
    n = maybe_node(w, "Notify Google Chat")
    if n is None:
        w["nodes"].append(
            nodo_http_chat(
                "78546421-004b-41b8-ace1-db22d45b44d5",
                url,
                SUBA_CHAT_BODY,
                [900, 40],
            )
        )
        cambios.append("Sub A: nodo Notify Google Chat")
    else:
        actual = str((n.get("parameters") or {}).get("url") or "")
        if not es_webhook_chat(actual):
            n["parameters"]["url"] = url
            cambios.append("Sub A: webhook Chat clonado del Wizard")
        body = str((n.get("parameters") or {}).get("jsonBody") or "")
        if "Instant Form" not in body:
            n["parameters"]["jsonBody"] = SUBA_CHAT_BODY
            cambios.append("Sub A: texto Chat Instant Form")
    if ensure_edge(w["connections"], "Prepare Lead Data", "Notify Google Chat"):
        cambios.append("Sub A: Prepare Lead Data → Notify Google Chat")
    return cambios


def ensure_meet_chat(w: dict, url: str) -> list[str]:
    cambios: list[str] = []
    prep = maybe_node(w, "Preparar aviso Chat")
    if prep is None:
        w["nodes"].append(
            {
                "parameters": {
                    "mode": "runOnceForAllItems",
                    "jsCode": MEET_PREP_CODE,
                },
                "id": "f3d1d850-3daf-4523-88ec-0832dfab3dde",
                "name": "Preparar aviso Chat",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [1120, 120],
                "onError": "continueRegularOutput",
            }
        )
        cambios.append("Meet: nodo Preparar aviso Chat")
    else:
        code = str((prep.get("parameters") or {}).get("jsCode") or "")
        if "esPrueba" not in code or "textoChat" not in code:
            prep["parameters"]["jsCode"] = MEET_PREP_CODE
            cambios.append("Meet: código Preparar aviso Chat")
    n = maybe_node(w, "Notify Google Chat")
    if n is None:
        w["nodes"].append(
            nodo_http_chat(
                "7beb9c5d-ff06-4785-b8b1-770666cf007f",
                url,
                "={{ JSON.stringify({ text: $json.textoChat }) }}",
                [1340, 120],
            )
        )
        cambios.append("Meet: nodo Notify Google Chat")
    else:
        actual = str((n.get("parameters") or {}).get("url") or "")
        if not es_webhook_chat(actual):
            n["parameters"]["url"] = url
            cambios.append("Meet: webhook Chat clonado del Wizard")
    if ensure_edge(w["connections"], "Crear Evento + Meet", "Preparar aviso Chat"):
        cambios.append("Meet: Crear Evento + Meet → Preparar aviso Chat")
    if ensure_edge(w["connections"], "Preparar aviso Chat", "Notify Google Chat"):
        cambios.append("Meet: Preparar aviso Chat → Notify Google Chat")
    return cambios


def recable_wizard_chat(w: dict) -> list[str]:
    """Chat inmediato al contacto; el wait de 60 s ya no avisa."""
    cambios: list[str] = []
    if remove_edge(w["connections"], "Baserow - Check Booking", "Notify Google Chat"):
        cambios.append("Wizard: Check Booking ya no avisa a Chat")
    if ensure_edge(w["connections"], "Solo etapa de contacto", "Notify Google Chat"):
        cambios.append("Wizard: Solo etapa de contacto → Notify Google Chat")
    # Clinera @744 (agendó) sigue colgando del wait — no es Chat, pero se
    # cortó al recablear y hay que reponerlo.
    for src, dest in (
        ("Solo etapa de contacto", "Wait Booking 60s"),
        ("Wait Booking 60s", "Baserow - Check Booking"),
        ("Baserow - Check Booking", "Agendó?"),
    ):
        if ensure_edge(w["connections"], src, dest):
            cambios.append(f"Wizard: {src} → {dest}")
    if ensure_edge(
        w["connections"], "Agendó?", "Clinera - Crear @744 (Agendó)", output_index=0
    ):
        cambios.append("Wizard: Agendó? → Clinera @744")
    return cambios


def twenty_via_n8n(js: str, nombre: str) -> dict:
    path = "tmp-" + uuid.uuid4().hex[:8]
    wf = {
        "name": nombre,
        "nodes": [
            {
                "parameters": {
                    "httpMethod": "GET",
                    "path": path,
                    "responseMode": "lastNode",
                    "options": {},
                },
                "id": "wh",
                "name": "Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 2,
                "position": [0, 0],
                "webhookId": path,
            },
            {
                "parameters": {"mode": "runOnceForAllItems", "jsCode": js},
                "id": "code",
                "name": "Peek",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [220, 0],
            },
        ],
        "connections": {
            "Webhook": {"main": [[{"node": "Peek", "type": "main", "index": 0}]]}
        },
        "settings": {"executionOrder": "v1"},
    }
    created = api("POST", "/workflows", wf)
    wid = created.get("id")
    if not wid:
        raise SystemExit(f"no pude crear el workflow temporal {nombre}")
    try:
        api("POST", f"/workflows/{wid}/activate")
        time.sleep(1.5)
        req = urllib.request.Request(
            f"https://n8n.oacg.cl/webhook/{path}",
            headers={"Accept": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=45) as resp:
            out = json.loads(resp.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        detalle = e.read().decode("utf-8", "replace")[:400]
        raise SystemExit(f"{nombre} → {e.code}: {detalle}") from e
    finally:
        try:
            api("POST", f"/workflows/{wid}/deactivate")
        except SystemExit:
            pass
        try:
            api("DELETE", f"/workflows/{wid}")
        except SystemExit:
            pass
    return out if isinstance(out, dict) else {}


def retarget_leads_del_dia(dry: bool) -> list[str]:
    """«Leads del día» mira horaRegistro (último formulario), no createdAt."""
    js = f"""
const KEY = $env.TWENTY_API_KEY;
const api = async (method, path, body) => this.helpers.httpRequest({{
  method, url: 'https://crm.oacg.cl' + path,
  headers: {{ Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }},
  json: true, timeout: 20000, body,
}});
const VIEW = '{VISTA_LEADS_DIA}';
const HORA = '{CAMPO_HORA_REGISTRO}';
const v = await api('GET', '/rest/metadata/views/' + VIEW);
const f = (v.viewFilters || []).find((x) => x.operand === 'IS_TODAY');
if (!f) return [{{ json: {{ ok: false, motivo: 'sin filtro IS_TODAY' }} }}];
if (f.fieldMetadataId === HORA) return [{{ json: {{ ok: true, ya: true, id: f.id }} }}];
await api('PATCH', '/rest/metadata/viewFilters/' + f.id, {{ fieldMetadataId: HORA }});
return [{{ json: {{ ok: true, from: f.fieldMetadataId, to: HORA, id: f.id }} }}];
"""
    if dry:
        return ["dry-run: vista Leads del día → horaRegistro IS_TODAY"]
    out = twenty_via_n8n(js, "tmp-vista-leads-dia-640b")
    if out.get("ya"):
        return []
    if not out.get("ok"):
        raise SystemExit(f"vista Leads del día: {out}")
    return ["vista Leads del día: IS_TODAY ahora es horaRegistro"]


def retarget_columnas_leads_dia(dry: bool) -> list[str]:
    """Quita Web/Instagram, Ciudad y Cargo; deja Notas para el recotizó."""
    js = f"""
const KEY = $env.TWENTY_API_KEY;
const api = async (method, path, body) => this.helpers.httpRequest({{
  method, url: 'https://crm.oacg.cl' + path,
  headers: {{ Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }},
  json: true, timeout: 25000, body,
}});
const HIDE = [
  {{ id: '{CAMPO_SITIO_WEB}', name: 'sitioWeb' }},
  {{ id: '{CAMPO_CIUDAD}', name: 'ciudad' }},
  {{ id: '{CAMPO_CARGO}', name: 'cargo' }},
  {{ id: '{CAMPO_NOTE_TARGETS}', name: 'noteTargets' }},
];
const NOTES = '{CAMPO_NOTAS}';
const views = ['{VISTA_LEADS_DIA}', '{VISTA_TODAS}'];
const out = {{ hidden: [], notes: null }};
for (const viewId of views) {{
  const v = await api('GET', '/rest/metadata/views/' + viewId);
  const fields = v.viewFields || [];
  for (const hid of HIDE) {{
    const f = fields.find((x) => x.fieldMetadataId === hid.id);
    if (f && f.isVisible) {{
      await api('PATCH', '/rest/metadata/viewFields/' + f.id, {{ isVisible: false }});
      out.hidden.push(v.name + ':' + hid.name);
    }}
  }}
  if (viewId === '{VISTA_LEADS_DIA}') {{
    let notes = fields.find((x) => x.fieldMetadataId === NOTES);
    if (!notes) {{
      await api('POST', '/rest/metadata/viewFields', {{
        viewId, fieldMetadataId: NOTES, isVisible: true, position: 9, size: 280,
      }});
      out.notes = 'created';
    }} else if (!notes.isVisible) {{
      await api('PATCH', '/rest/metadata/viewFields/' + notes.id, {{
        isVisible: true, position: 9, size: 280,
      }});
      out.notes = 'shown';
    }} else {{
      out.notes = 'ya';
    }}
  }}
}}
return [{{ json: {{ ok: true, ...out }} }}];
"""
    if dry:
        return ["dry-run: Leads del día oculta Web/Ciudad/Cargo y muestra Notas"]
    out = twenty_via_n8n(js, "tmp-vista-cols-notas-640b")
    if not out.get("ok"):
        raise SystemExit(f"columnas Leads del día: {out}")
    cambios = []
    if out.get("hidden"):
        cambios.append("vista: ocultas " + ", ".join(out["hidden"]))
    if out.get("notes") in ("created", "shown"):
        cambios.append("Leads del día: columna Notas")
    return cambios


def reparar_nota_recotizo(dry: bool) -> list[str]:
    """El 5º Instant Form se repuso a mano; pisa la columna Notas."""
    js = f"""
const KEY = $env.TWENTY_API_KEY;
const api = async (method, path, body) => this.helpers.httpRequest({{
  method, url: 'https://crm.oacg.cl' + path,
  headers: {{ Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }},
  json: true, timeout: 25000, body,
}});
const OPP = '{OPP_NOTA_RECOTIZO}';
const TEXTO = '🔁 Ya había cotizado';
const opp = await api('GET', '/rest/opportunities/' + OPP);
const rec = opp?.data?.opportunity || opp?.opportunity || {{}};
const yaTexto = String(rec.notas || '').includes('Ya había cotizado');
if (!yaTexto) {{
  await api('PATCH', '/rest/opportunities/' + OPP, {{ notas: TEXTO }});
}}
return [{{ json: {{ ok: true, yaTexto, patched: !yaTexto, notas: TEXTO }} }}];
"""
    if dry:
        return ["dry-run: columna Notas en el negocio repuesto"]
    out = twenty_via_n8n(js, "tmp-nota-recotizo-640b")
    if not out.get("ok"):
        raise SystemExit(f"nota recotizó: {out}")
    if out.get("yaTexto"):
        return []
    return ["negocio repuesto: columna Notas"]


def activar(wid: str) -> None:
    api("POST", f"/workflows/{wid}/activate")


def main() -> int:
    if not KEY:
        print("Falta N8N_API_KEY", file=sys.stderr)
        return 2
    dry = "--dry-run" in sys.argv

    suba = api("GET", f"/workflows/{SUB_A}")
    wiz = api("GET", f"/workflows/{WIZARD}")
    meet = api("GET", f"/workflows/{MEET}")
    url = webhook_del_wizard(wiz)

    por_wf = {
        SUB_A: (
            suba,
            inject_hora_crear(suba, "Sub A")
            + inject_hora_refresco(suba, "Sub A")
            + inject_nota_recotizo(suba, "Sub A")
            + inject_phone_lookup(suba, "Sub A")
            + inject_verify_opp(suba, "Sub A")
            + inject_persona_ya_existia(suba, "Sub A")
            + inject_nota_al_crear(suba, "Sub A")
            + inject_notas_texto(suba, "Sub A")
            + ensure_suba_chat(suba, url),
        ),
        WIZARD: (
            wiz,
            inject_hora_crear(wiz, "Wizard")
            + inject_hora_refresco(wiz, "Wizard")
            + inject_nota_recotizo(wiz, "Wizard")
            + inject_phone_lookup(wiz, "Wizard")
            + inject_verify_opp(wiz, "Wizard")
            + inject_persona_ya_existia(wiz, "Wizard")
            + inject_nota_al_crear(wiz, "Wizard")
            + inject_notas_texto(wiz, "Wizard")
            + recable_wizard_chat(wiz),
        ),
        MEET: (meet, inject_hora_meet(meet) + ensure_meet_chat(meet, url)),
    }

    cambios = [c for _, cs in por_wf.values() for c in cs]
    vista = retarget_leads_del_dia(dry)
    cambios.extend(vista)
    cambios.extend(retarget_columnas_leads_dia(dry))
    cambios.extend(reparar_nota_recotizo(dry))
    if not cambios:
        print("Ya estaba aplicado. Nada que escribir.")
        return 0
    for c in cambios:
        print("-", c)
    if dry:
        print("dry-run: no se escribió n8n.")
        return 0
    for wid, (w, cs) in por_wf.items():
        if not cs:
            continue
        api("PUT", f"/workflows/{wid}", payload_de(w))
        activar(wid)
        print("n8n actualizado y reactivado:", w.get("name"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
