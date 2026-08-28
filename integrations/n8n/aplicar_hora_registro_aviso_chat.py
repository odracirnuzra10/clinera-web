#!/usr/bin/env python3
"""Hora exacta de registro en Twenty + aviso a Google Chat.

Ricardo, 28-ago-2026: el `createdAt` de sistema de la Opportunity se muestra
como «hace 3 horas» (`displayFormat: RELATIVE`) y Twenty responde 403 si se
intenta cambiarlo. El negocio tiene el campo custom `horaRegistro` (DATE_TIME,
label «Hora de registro») con el mismo formato absoluto que Fecha demo.
n8n lo escribe solo al CREAR el negocio — un agendamiento posterior no lo pisa.

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
        SUB_A: (suba, inject_hora_crear(suba, "Sub A") + ensure_suba_chat(suba, url)),
        WIZARD: (
            wiz,
            inject_hora_crear(wiz, "Wizard") + recable_wizard_chat(wiz),
        ),
        MEET: (meet, inject_hora_meet(meet) + ensure_meet_chat(meet, url)),
    }

    cambios = [c for _, cs in por_wf.values() for c in cs]
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
