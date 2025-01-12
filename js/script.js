// -----------------------------
// Elementos del DOM
// -----------------------------
const zonaArrastre = document.getElementById('zona-arrastre'); // Área de arrastre
const inputArchivos = document.getElementById('archivos'); // Input oculto para seleccionar archivos
const listaArchivos = document.getElementById('lista-archivos'); // Lista para mostrar archivos seleccionados
const botonCombinar = document.getElementById('combinar'); // Botón para combinar archivos
const resultado = document.getElementById('resultado'); // Contenedor del enlace de descarga

// -----------------------------
// Función: Actualizar la lista de archivos visibles
// -----------------------------
const actualizarListaArchivos = (archivos) => {
    listaArchivos.innerHTML = ''; // Limpiar la lista existente
    Array.from(archivos).forEach((archivo) => {
        const li = document.createElement('li'); // Crear un elemento <li>
        li.textContent = archivo.name; // Asignar el nombre del archivo
        listaArchivos.appendChild(li); // Añadir el <li> al contenedor
    });
};

// -----------------------------
// Evento: Abrir el selector de archivos al hacer clic en la zona de arrastre
// -----------------------------
zonaArrastre.addEventListener('click', () => {
    inputArchivos.click(); // Simular clic en el input
});

// -----------------------------
// Evento: Cambiar el estilo al arrastrar un archivo sobre la zona
// -----------------------------
zonaArrastre.addEventListener('dragover', (event) => {
    event.preventDefault(); // Prevenir comportamiento predeterminado
    zonaArrastre.classList.add('dragover'); // Añadir estilo de arrastre
});

// -----------------------------
// Evento: Restaurar el estilo al salir de la zona de arrastre
// -----------------------------
zonaArrastre.addEventListener('dragleave', () => {
    zonaArrastre.classList.remove('dragover'); // Quitar estilo de arrastre
});

// -----------------------------
// Evento: Manejar archivos soltados en la zona de arrastre
// -----------------------------
zonaArrastre.addEventListener('drop', (event) => {
    event.preventDefault(); // Prevenir comportamiento predeterminado
    zonaArrastre.classList.remove('dragover'); // Quitar estilo de arrastre

    const archivos = event.dataTransfer.files; // Obtener archivos soltados
    const archivosValidos = Array.from(archivos).filter(archivo => archivo.type === 'application/pdf'); // Filtrar PDFs

    if (archivosValidos.length === 0) {
        alert('Por favor, arrastra únicamente archivos PDF.');
        return;
    }

    inputArchivos.files = archivos; // Asignar archivos al input
    actualizarListaArchivos(archivosValidos); // Actualizar lista visible
    alert(`${archivosValidos.length} archivo(s) PDF añadido(s).`);
});

// -----------------------------
// Evento: Actualizar lista al seleccionar archivos manualmente
// -----------------------------
inputArchivos.addEventListener('change', () => {
    const archivos = inputArchivos.files; // Obtener archivos seleccionados
    actualizarListaArchivos(archivos); // Actualizar lista visible
});

// -----------------------------
// Función: Combinar PDFs
// -----------------------------
const combinarPDFs = async (archivos) => {
    try {
        const { PDFDocument } = window.PDFLib; // Cargar PDF-lib
        const pdfDoc = await PDFDocument.create(); // Crear documento vacío

        // Iterar sobre los archivos y añadir sus páginas al nuevo PDF
        for (let archivo of archivos) {
            const arrayBuffer = await archivo.arrayBuffer(); // Leer archivo como ArrayBuffer
            const pdf = await PDFDocument.load(arrayBuffer); // Cargar PDF
            const paginas = await pdfDoc.copyPages(pdf, pdf.getPageIndices()); // Copiar páginas
            paginas.forEach((pagina) => pdfDoc.addPage(pagina)); // Añadir páginas al nuevo PDF
        }

        return await pdfDoc.save(); // Retornar el PDF combinado como bytes
    } catch (error) {
        console.error('Error al combinar PDFs:', error);
        throw new Error('No se pudo combinar los PDFs.');
    }
};

// -----------------------------
// Evento: Combinar archivos al hacer clic en el botón
// -----------------------------
botonCombinar.addEventListener('click', async () => {
    const archivos = inputArchivos.files; // Obtener archivos seleccionados

    if (archivos.length < 2) {
        alert('Por favor, selecciona al menos dos archivos PDF.');
        return;
    }

    try {
        const pdfBytes = await combinarPDFs(archivos); // Llamar a la función de combinar PDFs

        // Crear blob para descarga
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob); // Crear URL temporal

        // Mostrar enlace de descarga
        resultado.innerHTML = `<a href="${url}" download="combinado.pdf">Descargar PDF combinado</a>`;

        // Revocar URL después de 1 minuto
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
        alert(error.message); // Mostrar mensaje de error al usuario
    }
});