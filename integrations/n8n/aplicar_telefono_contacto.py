#!/usr/bin/env python3
"""Copia el teléfono del contacto al negocio en Twenty.

Ricardo, 28-ago-2026: en la vista de Negocios hace falta ver el número sin
abrir la Persona. Twenty no muestra el teléfono de `pointOfContact` como
columna de la Opportunity — vive en otro objeto. Por eso el negocio tiene
el campo denormalizado `telefonoContacto` (tipo PHONES, label «Teléfono
del contacto») y n8n lo llena al crear o refrescar el lead.

Este script toca n8n vivo (Sub A + Wizard + Meet). El campo y las columnas
de las vistas ya están en crm.oacg.cl; no los recrea. Requiere N8N_API_KEY.

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
MEET = "FZvyK42lkQdKWcIl"

PHONE_LEAD = """
        if (d.phone) {
          const ccTel = PREFIJO[d.country] || '';
          const nacionalTel = ccTel && String(d.phone).startsWith(ccTel.slice(1))
            ? String(d.phone).slice(ccTel.length - 1)
            : String(d.phone);
          {target}.telefonoContacto = {
            primaryPhoneNumber: nacionalTel,
            primaryPhoneCallingCode: ccTel,
            additionalPhones: [],
          };
        }
"""

MEET_PATCH_OLD = (
    "    const patch = { ultimoContacto: new Date().toISOString() };\n\n"
    "    // `startISO`"
)
MEET_PATCH_NEW = (
    "    const patch = { ultimoContacto: new Date().toISOString() };\n"
    "    const brutoPatch = String((reserva.cliente && reserva.cliente.telefono) || '').replace(/\\D/g, '');\n"
    "    if (brutoPatch) {\n"
    "      const countryPatch = paisDeTelefono(brutoPatch);\n"
    "      const ccPatch = PREFIJO[countryPatch] || '';\n"
    "      const nacionalPatch = ccPatch && brutoPatch.startsWith(ccPatch.slice(1))"
    " ? brutoPatch.slice(ccPatch.length - 1) : brutoPatch;\n"
    "      patch.telefonoContacto = {\n"
    "        primaryPhoneNumber: nacionalPatch,\n"
    "        primaryPhoneCallingCode: ccPatch,\n"
    "        additionalPhones: [],\n"
    "      };\n"
    "    }\n\n"
    "    // `startISO`"
)

MEET_CREATE_OLD = (
    "    if (patch.enlaceDemo) negocioNuevo.enlaceDemo = patch.enlaceDemo;\n\n"
    "    const opportunityId = crear("
)
MEET_CREATE_NEW = (
    "    if (patch.enlaceDemo) negocioNuevo.enlaceDemo = patch.enlaceDemo;\n"
    "    const brutoTel = String((reserva.cliente && reserva.cliente.telefono) || '').replace(/\\D/g, '');\n"
    "    if (brutoTel) {\n"
    "      const ccTel = PREFIJO[country] || '';\n"
    "      const nacionalTel = ccTel && brutoTel.startsWith(ccTel.slice(1))"
    " ? brutoTel.slice(ccTel.length - 1) : brutoTel;\n"
    "      negocioNuevo.telefonoContacto = {\n"
    "        primaryPhoneNumber: nacionalTel,\n"
    "        primaryPhoneCallingCode: ccTel,\n"
    "        additionalPhones: [],\n"
    "      };\n"
    "    }\n\n"
    "    const opportunityId = crear("
)


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


def inject_lead(code: str, target: str, after: str) -> str | None:
    """Inserta el bloque PHONES después de `after` si aún no está en `target`."""
    if f"{target}.telefonoContacto" in code:
        return None
    needle = after
    if needle not in code:
        raise SystemExit(f"no encuentro ancla {after!r}")
    block = PHONE_LEAD.replace("{target}", target)
    return code.replace(needle, needle + block, 1)


def patch_crear_lead(w: dict, etiqueta: str) -> list[str]:
    cambios: list[str] = []
    n = node(w, "Twenty - Crear Lead")
    code = n["parameters"]["jsCode"]
    for target, after in (
        ("refresco", "        if (d.tipoClinica) refresco.tipoClinica = d.tipoClinica;"),
        ("negocio", "        if (d.tipoClinica) negocio.tipoClinica = d.tipoClinica;"),
    ):
        nuevo = inject_lead(code, target, after)
        if nuevo is None:
            continue
        code = nuevo
        cambios.append(f"{etiqueta} Twenty: {target}.telefonoContacto")
    n["parameters"]["jsCode"] = code
    return cambios


def patch_meet(w: dict) -> list[str]:
    n = node(w, "Twenty - Agendó (Meet)")
    code = n["parameters"]["jsCode"]
    if code.count("telefonoContacto") >= 2:
        return []
    cambios: list[str] = []
    if MEET_PATCH_OLD in code:
        code = code.replace(MEET_PATCH_OLD, MEET_PATCH_NEW, 1)
        cambios.append("Meet Twenty: patch.telefonoContacto")
    elif "patch.telefonoContacto" not in code:
        raise SystemExit("Meet: no encuentro ancla del PATCH")
    if MEET_CREATE_OLD in code:
        code = code.replace(MEET_CREATE_OLD, MEET_CREATE_NEW, 1)
        cambios.append("Meet Twenty: negocioNuevo.telefonoContacto")
    elif "negocioNuevo.telefonoContacto" not in code:
        raise SystemExit("Meet: no encuentro ancla del POST")
    n["parameters"]["jsCode"] = code
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
    meet = api("GET", f"/workflows/{MEET}")
    cambios = (
        patch_crear_lead(suba, "Sub A")
        + patch_crear_lead(wiz, "Wizard")
        + patch_meet(meet)
    )
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
    api("PUT", f"/workflows/{MEET}", payload_de(meet))
    print("n8n actualizado: Sub A + Wizard + Meet.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
