#!/usr/bin/env python3
"""Alinea Twenty + CAPI del wizard con el idioma Lead / MQL / SQL / SQL+.

Ricardo, 28-ago-2026:

  Lead  US$ 5   formulario sin cita     Twenty NEW (Nuevo)
  MQL   US$ 10  formulario y además agendó  Twenty SCREENING (MQL)
  SQL   US$ 100 closer en Twenty MEETING
  SQL+  US$ 300 closer en Twenty PROPOSAL

SQL y SQL+ ya estaban bien. Lo que mentía era el alta: Instant Form y el
wizard nacían en SCREENING (el tablero dice «MQL») aunque nadie había
agendado, y el CAPI del wizard mandaba `MQL` US$ 10 al llenar /ventas.

Este script toca n8n vivo (Sub A + Wizard). No recablea el HUB. No toca
Hebe/Lumina. Requiere N8N_API_KEY.

Idempotente: si ya está aplicado, no escribe.
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

SUB_A_OLD = "    const etapaDestino = 'SCREENING';"
SUB_A_NEW = "    const etapaDestino = 'NEW';"

WIZARD_OLD = "    const etapaDestino = 'SCREENING';"
WIZARD_NEW = "    const etapaDestino = agendo ? 'SCREENING' : 'NEW';"


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
            return json.load(resp)
    except urllib.error.HTTPError as e:
        detalle = e.read().decode("utf-8", "replace")[:800]
        raise SystemExit(f"{method} {path} → {e.code}: {detalle}") from e


def node(w: dict, name: str) -> dict:
    for n in w["nodes"]:
        if n.get("name") == name:
            return n
    raise SystemExit(f"no está el nodo {name!r} en {w.get('name')}")


def patch_suba(w: dict) -> list[str]:
    cambios: list[str] = []
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if SUB_A_OLD in code:
        code = code.replace(SUB_A_OLD, SUB_A_NEW, 1)
        cambios.append("Sub A Twenty: etapaDestino NEW")
    elif SUB_A_NEW not in code:
        raise SystemExit("Sub A: no encuentro etapaDestino")
    if "nace en SCREENING; el MQL se gana en PQL" in code:
        code = code.replace(
            "nace en SCREENING; el MQL se gana en PQL",
            "nace en NEW (Lead); el MQL se gana agendando",
        )
        cambios.append("Sub A Twenty: comentario etapa")
    if "etapa SCREENING, canal META_ADS" in code:
        code = code.replace(
            "etapa SCREENING, canal META_ADS",
            "etapa NEW (Lead), canal META_ADS",
        )
        cambios.append("Sub A Twenty: comentario header etapa")
    viejo_pql = (
        "//      el MQL (US$ 10) se gana al pasar a PQL en Twenty. No nace en\n"
        "//      Nuevo ni con «Ads» a secas — eso es lo que se veía en Lab Memdo."
    )
    if viejo_pql in code:
        code = code.replace(
            viejo_pql,
            "//      el MQL (US$ 10) se gana al agendar en /reserva-tu-hora. Nace en\n"
            "//      NEW (Lead / Nuevo), no en SCREENING: el tablero no puede decir MQL\n"
            "//      si todavía no hay cita.",
        )
        cambios.append("Sub A Twenty: comentario PQL")
    n["parameters"]["jsCode"] = code

    prep = node(w, "Prepare Lead Data")
    pcode = prep["parameters"]["jsCode"]
    viejo = (
        "El MQL\n// (US$ 10) se gana después, cuando el negocio pasa a PQL en Twenty — el form\n"
        "// ya NO es el MQL."
    )
    nuevo = (
        "El MQL\n// (US$ 10) se gana después, cuando agendan en /reserva-tu-hora — el form\n"
        "// es Lead US$ 5, no MQL."
    )
    if viejo in pcode:
        prep["parameters"]["jsCode"] = pcode.replace(viejo, nuevo, 1)
        cambios.append("Sub A Prepare Lead Data: comentario PQL → agendó")
    return cambios


def patch_wizard(w: dict) -> list[str]:
    cambios: list[str] = []
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    if WIZARD_OLD in code:
        code = code.replace(WIZARD_OLD, WIZARD_NEW, 1)
        cambios.append("Wizard Twenty: NEW si no agendó, SCREENING si agendó")
    elif WIZARD_NEW not in code:
        raise SystemExit("Wizard Twenty: no encuentro etapaDestino")
    if (
        "Todo el que completa el formulario entra como MQL. Subirlo a SQL o SQL+\n"
        "    // es decisión de ventas (Nohe, Rebe o Cheul) en el CRM; ni el formulario ni\n"
        "    // el agendamiento lo hacen solos."
    ) in code:
        code = code.replace(
            "Todo el que completa el formulario entra como MQL. Subirlo a SQL o SQL+\n"
            "    // es decisión de ventas (Nohe, Rebe o Cheul) en el CRM; ni el formulario ni\n"
            "    // el agendamiento lo hacen solos.",
            "Formulario sin cita = Lead (NEW). Formulario y además agendó = MQL\n"
            "    // (SCREENING). Subirlo a SQL o SQL+ es decisión de ventas (Nohe, Rebe o\n"
            "    // Cheul) en el CRM; ni el formulario ni el agendamiento lo hacen solos.",
        )
        cambios.append("Wizard Twenty: comentario Lead/MQL")
    if "SQL si agendó, MQL si no" in code:
        code = code.replace(
            "stage: etapaDestino,                            // SQL si agendó, MQL si no",
            "stage: etapaDestino,                            // MQL si agendó, Lead si no",
        )
        cambios.append("Wizard Twenty: comentario stage")
    n["parameters"]["jsCode"] = code

    capi = node(w, "Meta CAPI - MQL")
    body = capi["parameters"].get("jsonBody") or ""
    if '"event_name": "Lead"' in body or '"event_name": \\"Lead\\"' in body:
        pass
    elif '"event_name": "MQL"' not in body:
        raise SystemExit("Wizard CAPI: no encuentro event_name MQL")
    else:
        body = body.replace('"event_name": "MQL"', '"event_name": "Lead"', 1)
        body = body.replace('"value":10', '"value":5', 1)
        body = body.replace("Sales Demo Booking", "Lead - Formulario sin agendar", 1)
        capi["parameters"]["jsonBody"] = body
        cambios.append("Wizard CAPI contacto: MQL US$ 10 → Lead US$ 5")

    gate = node(w, "No es booking confirmado?")
    conds = (
        gate.get("parameters", {})
        .get("conditions", {})
        .get("conditions", [])
    )
    # Ya no hay que silenciar /agenda: ese filtro existía para no mandar un
    # segundo MQL. El nodo ahora es Lead US$ 5, y el MQL de /agenda lo sigue
    # emitiendo el workflow de reserva al agendar.
    sin_agenda = [
        c
        for c in conds
        if not (
            c.get("operator", {}).get("operation") == "notContains"
            and str(c.get("rightValue") or "") == "/agenda"
        )
    ]
    if len(sin_agenda) != len(conds):
        conds[:] = sin_agenda
        cambios.append("Wizard CAPI: /agenda contacto ahora es Lead US$ 5")
    urls = [
        str(c.get("rightValue") or "")
        for c in conds
        if c.get("operator", {}).get("operation") == "notContains"
    ]
    if "/reserva-tu-hora" not in urls:
        conds.append(
            {
                "id": "4-no-reserva-hora",
                "leftValue": "={{ $json.landing_url }}",
                "rightValue": "/reserva-tu-hora",
                "operator": {
                    "type": "string",
                    "operation": "notContains",
                },
            }
        )
        cambios.append("Wizard CAPI: no dispara en /reserva-tu-hora (Lead ya lo mandó Sub A)")
    return cambios


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


def main() -> int:
    if not KEY:
        print("Falta N8N_API_KEY", file=sys.stderr)
        return 2
    dry = "--dry-run" in sys.argv

    suba = api("GET", f"/workflows/{SUB_A}")
    wiz = api("GET", f"/workflows/{WIZARD}")
    cambios = patch_suba(suba) + patch_wizard(wiz)
    if not cambios:
        print("Ya estaba aplicado. Nada que escribir.")
        return 0
    for c in cambios:
        print("-", c)
    if dry:
        print("dry-run: no se escribió n8n.")
        return 0
    api("PUT", f"/workflows/{SUB_A}", payload_de(suba))
    api("PUT", f"/workflows/{WIZARD}", payload_de(wiz))
    print("n8n actualizado: Sub A + Wizard.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
