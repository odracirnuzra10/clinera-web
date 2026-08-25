# Fotos de partners

Una imagen por partner, el archivo se llama como el `slug`.

Ejemplo: Katherine Meza → `katherine.jpg`

## Specs

- Cuadrada (1:1)
- Mínimo 800 × 800 px
- Fondo limpio, sin recortes raros ni marcas de agua
- Rostro centrado, hombros visibles
- JPG o PNG
- Color de origen: no hace falta preprocesar a blanco y negro

Si el archivo no está, la landing y la imagen OG muestran las iniciales sobre `#F7F6F3`. Nunca un ícono roto.

La ruta pública es `/partners/<slug>.jpg` y coincide con el campo `photo` en `src/lib/partners.ts`.
