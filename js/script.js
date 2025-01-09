// Escuchar el evento de clic en el botón "Combinar"
document.getElementById('combinar').addEventListener('click', async () => {
    const archivos = document.getElementById('archivos').files;

    // Validar si el usuario seleccionó al menos dos archivos PDF
    if (archivos.length < 2) {
        alert('Por favor, selecciona al menos dos archivos PDF.');
        return;
    }

    try {
        // Cargar la librería PDF-lib
        const { PDFDocument } = window.PDFLib;

        // Crear un nuevo documento PDF
        const pdfDoc = await PDFDocument.create();

        // Iterar sobre los archivos seleccionados
        for (let archivo of archivos) {
            const arrayBuffer = await archivo.arrayBuffer(); // Leer el archivo como ArrayBuffer
            const pdf = await PDFDocument.load(arrayBuffer); // Cargar el PDF

            // Copiar todas las páginas del PDF seleccionado al nuevo documento
            const pages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
            pages.forEach((page) => pdfDoc.addPage(page));
        }

        // Generar el PDF combinado como bytes
        const pdfBytes = await pdfDoc.save();

        // Crear un blob del PDF combinado
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Generar un enlace para descargar el PDF combinado
        const resultado = document.getElementById('resultado');
        resultado.innerHTML = `<a href="${url}" download="combinado.pdf">Descargar PDF combinado</a>`;

        // Opcional: Desactivar el enlace después de cierta cantidad de tiempo
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 60000); // 1 minuto
    } catch (error) {
        console.error('Error al combinar PDFs:', error);
        alert('Ocurrió un error al combinar los PDFs. Por favor, intenta de nuevo.');
    }
});