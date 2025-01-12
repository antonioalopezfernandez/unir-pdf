# Unir PDF
Este proyecto permite a los usuarios combinar múltiples archivos PDF en un único archivo PDF de manera sencilla y eficiente directamente desde el navegador.

## Características
- **Subida de Archivos:** Los usuarios pueden seleccionar varios archivos PDF desde su dispositivo o arrastrarlos a la interfaz.
- **Reorganización de Archivos:** Los usuarios pueden cambiar el orden de los archivos PDF antes de combinarlos utilizando los controles de mover hacia arriba o hacia abajo.
- **Eliminar Archivos:** Es posible eliminar archivos individualmente de la lista antes de proceder a la combinación.
- **Combinar Archivos:** Los archivos PDF seleccionados se combinan en el orden especificado por el usuario.
- **Descargar Resultado:** El archivo combinado se genera en el navegador y se ofrece como descarga al usuario.
- **Interfaz Responsiva:** El diseño se adapta tanto a dispositivos móviles como a pantallas más grandes.
- **Seguridad:** Todo el procesamiento se realiza localmente en el navegador, lo que significa que ningún archivo se carga en servidores externos.

## Tecnologías Utilizadas
- **Frontend:**
  - HTML5
  - CSS3 (Diseño adaptado con Flexbox, colores personalizados y controles interactivos)
  - JavaScript ES6+

- **Librerías:**
  - [PDF-lib](https://pdf-lib.js.org/) para manipulación de archivos PDF.

## Requisitos Previos
No se requiere instalación de software adicional, ya que este proyecto funciona directamente en el navegador. Solo necesitas un navegador moderno compatible con JavaScript.

## Cómo Usar
1. Haz clic en el área de arrastrar y soltar para seleccionar tus archivos PDF, o arrástralos directamente a la interfaz.
2. Organiza los archivos:
   - Usa los botones `⬆️` y `⬇️` para cambiar el orden de los archivos.
   - Usa el botón `🗑️` para eliminar cualquier archivo no deseado.
3. Haz clic en el botón "Combinar" para generar el archivo combinado.
4. Descarga el archivo PDF combinado desde el enlace que aparece.

## Licencia
Este proyecto está bajo la licencia MIT.