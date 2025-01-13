// -----------------------------
// Elementos del DOM
// -----------------------------
const zonaArrastre = document.getElementById('zona-arrastre'); // Área de arrastre
const inputArchivos = document.getElementById('archivos'); // Input oculto para seleccionar archivos
const listaArchivos = document.getElementById('lista-archivos'); // Lista para mostrar archivos seleccionados
const botonCombinar = document.getElementById('combinar'); // Botón para combinar archivos
const resultado = document.getElementById('resultado'); // Contenedor del enlace de descarga

// Archivos seleccionados (cola)
let archivosSeleccionados = [];

// -----------------------------
// Función: Actualizar la lista de archivos visibles
// -----------------------------
const actualizarListaArchivos = () => {
    listaArchivos.innerHTML = ''; // Limpiar la lista existente

    archivosSeleccionados.forEach((archivo, index) => {
        const li = document.createElement('li'); // Crear un elemento <li>

        // Crear contenedor para el nombre del archivo
        const span = document.createElement('span');
        span.textContent = archivo.name; // Asignar el nombre del archivo

        // Contenedor de botones
        const contenedorBotones = document.createElement('div');
        contenedorBotones.classList.add('lista-archivos-botones');

        // Botón para mover hacia arriba
        if (index > 0) {
            const btnArriba = document.createElement('button');
            btnArriba.textContent = '⬆️';
            btnArriba.title = 'Mover arriba';
            btnArriba.onclick = () => moverArchivo(index, index - 1);
            contenedorBotones.appendChild(btnArriba);
        }

        // Botón para mover hacia abajo
        if (index < archivosSeleccionados.length - 1) {
            const btnAbajo = document.createElement('button');
            btnAbajo.textContent = '⬇️';
            btnAbajo.title = 'Mover abajo';
            btnAbajo.onclick = () => moverArchivo(index, index + 1);
            contenedorBotones.appendChild(btnAbajo);
        }

        // Botón para eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '🗑️';
        btnEliminar.title = 'Eliminar';
        btnEliminar.onclick = () => eliminarArchivo(index);
        contenedorBotones.appendChild(btnEliminar);

        li.appendChild(span); // Añadir el nombre al elemento
        li.appendChild(contenedorBotones); // Añadir botones al elemento
        listaArchivos.appendChild(li); // Añadir elemento a la lista
    });
};

// -----------------------------
// Función: Mover un archivo en la cola
// -----------------------------
const moverArchivo = (indiceActual, nuevoIndice) => {
    const archivo = archivosSeleccionados[indiceActual];
    archivosSeleccionados.splice(indiceActual, 1); // Quitar archivo del índice actual
    archivosSeleccionados.splice(nuevoIndice, 0, archivo); // Insertar archivo en el nuevo índice
    actualizarListaArchivos(); // Actualizar lista visual
};

// -----------------------------
// Función: Eliminar un archivo de la cola
// -----------------------------
const eliminarArchivo = (indice) => {
    archivosSeleccionados.splice(indice, 1); // Eliminar archivo del array
    actualizarListaArchivos(); // Actualizar lista visual
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

    const archivos = Array.from(event.dataTransfer.files).filter((archivo) => archivo.type === 'application/pdf');
    archivosSeleccionados = archivosSeleccionados.concat(archivos); // Añadir nuevos archivos a la cola
    actualizarListaArchivos(); // Actualizar lista visual
});

// -----------------------------
// Evento: Actualizar lista al seleccionar archivos manualmente
// -----------------------------
inputArchivos.addEventListener('change', () => {
    const archivos = Array.from(inputArchivos.files);
    archivosSeleccionados = archivosSeleccionados.concat(archivos); // Añadir nuevos archivos
    actualizarListaArchivos(); // Actualizar lista visual
});

// -----------------------------
// Función: Combinar PDFs
// -----------------------------
const combinarPDFs = async () => {
    try {
        const { PDFDocument } = window.PDFLib; // Cargar PDF-lib
        const pdfDoc = await PDFDocument.create(); // Crear documento vacío

        for (const archivo of archivosSeleccionados) {
            try {
                const arrayBuffer = await archivo.arrayBuffer(); // Leer archivo como ArrayBuffer
                const pdf = await PDFDocument.load(arrayBuffer); // Cargar PDF normalmente
                const paginas = await pdfDoc.copyPages(pdf, pdf.getPageIndices()); // Copiar páginas
                paginas.forEach((pagina) => pdfDoc.addPage(pagina)); // Añadir páginas al nuevo PDF
            } catch (error) {
                console.warn(`No se pudo procesar el archivo ${archivo.name}:`, error);
                alert(`El archivo "${archivo.name}" está firmado o protegido. Será ignorado.`);
                continue; // Pasar al siguiente archivo
            }
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
    if (archivosSeleccionados.length < 2) {
        alert('Por favor, selecciona al menos dos archivos PDF.');
        return;
    }

    try {
        const pdfBytes = await combinarPDFs(); // Llamar a la función de combinar PDFs

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