#!/usr/bin/env python3
"""Agrega la opción «lanzamiento los angeles» al campo `etiquetas` de Negocios.

Sin esta opción, Twenty rechaza escribir `etiquetas: ['LANZAMIENTO_LOS_ANGELES']`
desde el workflow de postulación.

Uso:
  export TWENTY_API_KEY=...
  python3 etiqueta-lanzamiento-los-angeles.py             # simulacro
  python3 etiqueta-lanzamiento-los-angeles.py --aplicar   # escribe
"""
import json
import os
import ssl
import sys
import urllib.request

BASE = os.environ.get("TWENTY_URL", "https://crm.oacg.cl")
try:
    KEY = os.environ["TWENTY_API_KEY"].strip()
except KeyError:
    sys.exit("Falta TWENTY_API_KEY.")

CTX = ssl.create_default_context()
APLICAR = "--aplicar" in sys.argv
CAMPO = "etiquetas"
NUEVA = {
    "value": "LANZAMIENTO_LOS_ANGELES",
    "label": "lanzamiento los angeles",
    "color": "purple",
}


def gql(query, variables=None):
    req = urllib.request.Request(
        BASE + "/metadata",
        data=json.dumps({"query": query, "variables": variables or {}}).encode(),
        headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, context=CTX, timeout=60) as resp:
        data = json.load(resp)
    if data.get("errors"):
        raise RuntimeError(json.dumps(data["errors"], ensure_ascii=False)[:500])
    return data["data"]


meta = gql(
    'query{ objects(paging:{first:60}){ edges{ node{ nameSingular '
    'fields(paging:{first:200}){ edges{ node{ id name } } } } } } }'
)
field_id = None
for edge in meta["objects"]["edges"]:
    if edge["node"]["nameSingular"] != "opportunity":
        continue
    for fe in edge["node"]["fields"]["edges"]:
        if fe["node"]["name"] == CAMPO:
            field_id = fe["node"]["id"]
            break

if not field_id:
    sys.exit(f"No encontré el campo `{CAMPO}` en opportunity. Corre etiqueta_hot.py primero.")

options = gql('query($id:UUID!){ field(id:$id){ options } }', {"id": field_id})["field"]["options"]
values = {op.get("value") for op in options}

if NUEVA["value"] in values:
    print(f"= la opción `{NUEVA['label']}` ya existe — no hago nada")
    sys.exit(0)

nuevas = list(options)
nuevas.append({**NUEVA, "position": len(nuevas)})
print(("APLICA " if APLICAR else "simula ") + f"agregar opción `{NUEVA['label']}` ({NUEVA['value']})")

if not APLICAR:
    print(f"Opciones quedarían: {[op.get('label') for op in nuevas]}")
    sys.exit(0)

gql(
    'mutation($id:UUID!,$o:JSON!){ updateOneField(input:{id:$id, update:{options:$o}}){ id } }',
    {"id": field_id, "o": nuevas},
)
releidas = gql('query($id:UUID!){ field(id:$id){ options } }', {"id": field_id})["field"]["options"]
print("✓ aplicado. Opciones actuales:")
for op in releidas:
    print(f"  - {op.get('label')} ({op.get('value')})")
