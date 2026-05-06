// Referencias al DOM
const formularioBusqueda = document.getElementById('formulario-busqueda');
const entradaBusqueda = document.getElementById('entrada-busqueda');
const rejillaResultados = document.getElementById('rejilla-resultados');
const mensajeEstado = document.getElementById('mensaje-estado');
const modalDetalle = document.getElementById('modal-detalle');
const cuerpoDetalle = document.getElementById('cuerpo-detalle');
const botonCerrarModal = document.getElementById('cerrar-modal');

// Al iniciar la página, cargar recetas por defecto
window.addEventListener('DOMContentLoaded', () => {
    buscarRecetas('Beef'); // Carga inicial para que no esté vacío
});

// Función de búsqueda (Pauta: fetch / async / await)
async function buscarRecetas(termino) {
    try {
        // 4. Mostrar animación/mensaje de espera
        mostrarMensaje('Buscando las mejores recetas para ti...', true);
        rejillaResultados.innerHTML = '';

        const respuesta = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${termino}`);
        const datos = await respuesta.json();

        // 5. Manejo si la API no devuelve datos
        if (!datos.meals) {
            mostrarMensaje(`No se encontró nada para "${termino}". Prueba con ingredientes en inglés (ej: Chicken, Pasta, Rice).`, true);
            return;
        }

        ocultarMensaje();
        // 1. Mostrar al menos 10 registros
        renderizarLista(datos.meals.slice(0, 10));

    } catch (error) {
        // 5. Mensaje si la API falla
        console.error('Error de API:', error);
        mostrarMensaje('Ocurrió un error al conectar con el servidor. Revisa tu conexión.', true);
    }
}

// Función para crear las tarjetas
function renderizarLista(recetas) {
    recetas.forEach(receta => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-receta');
        tarjeta.innerHTML = `
            <img src="${receta.strMealThumb}" alt="${receta.strMeal}">
            <h3>${receta.strMeal}</h3>
        `;
        
        // 2. Al dar clic mostrar datos completos
        tarjeta.addEventListener('click', () => mostrarInformacionCompleta(receta));
        rejillaResultados.appendChild(tarjeta);
    });
}

// Función para el detalle (Punto 2 de pautas)
function mostrarInformacionCompleta(receta) {
    cuerpoDetalle.innerHTML = `
        <h2 style="color:var(--primario)">${receta.strMeal}</h2>
        <img src="${receta.strMealThumb}" style="width:100%; border-radius:10px; margin-bottom:15px">
        <p><strong>Categoría:</strong> ${receta.strCategory}</p>
        <p><strong>País:</strong> ${receta.strArea}</p>
        <h3>Instrucciones:</h3>
        <p style="line-height:1.6">${receta.strInstructions}</p>
    `;
    modalDetalle.classList.remove('oculto');
}

// Utilidades
function mostrarMensaje(texto, visible) {
    mensajeEstado.innerHTML = `<p>${texto}</p>`;
    mensajeEstado.classList.toggle('oculto', !visible);
}

function ocultarMensaje() {
    mensajeEstado.classList.add('oculto');
}

// Eventos
formularioBusqueda.addEventListener('submit', (e) => {
    e.preventDefault();
    const busqueda = entradaBusqueda.value.trim();
    if (busqueda) buscarRecetas(busqueda);
});

botonCerrarModal.addEventListener('click', () => {
    modalDetalle.classList.add('oculto');
});

// Cerrar modal al tocar fuera
window.onclick = (e) => {
    if (e.target === modalDetalle) modalDetalle.classList.add('oculto');
};
