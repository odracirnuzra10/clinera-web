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

El avatar de la landing es un círculo sobre `object-fit: cover`: recorta el
**centro** del cuadrado. Si la cara queda en la mitad de abajo (banner de
evento arriba), el círculo muestra la frente y el letrero. Yasna en
`/partner/yv` ya falló así — recortar desde `public/images/home/yasna.jpg`
con la cara en el centro, no reusar un cuadrado “amplio”.

Si el archivo no está, la landing y la imagen OG muestran las iniciales sobre `#F7F6F3`. Nunca un ícono roto.

La ruta pública es `/partners/<slug>.jpg` y coincide con el campo `photo` en `src/lib/partners.ts`.
