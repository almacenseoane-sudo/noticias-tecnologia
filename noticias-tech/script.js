const contenedor = document.getElementById('noticias');

async function cargarNoticias() {
  try {
    const respuesta = await fetch('/api/noticias');
    const datos = await respuesta.json();

    if (!datos.articles) {
      contenedor.innerHTML = '<p>Error al cargar las noticias.</p>';
      return;
    }

    contenedor.innerHTML = ''; // Limpiar

    datos.articles.slice(0, 10).forEach(noticia => {
      contenedor.innerHTML += `
        <div class="noticia">
          <h2 class="titulo">
            <a href="${noticia.url}" target="_blank" rel="noopener">
              ${noticia.title}
            </a>
          </h2>
          <p class="descripcion">${noticia.description || 'Sin descripción disponible.'}</p>
          <p class="fecha">Publicado: ${new Date(noticia.publishedAt).toLocaleString('es-ES')}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error al cargar noticias:", error);
    contenedor.innerHTML = '<p>No se pudieron cargar las noticias. Intenta más tarde.</p>';
  }
}

// Cargar al inicio
cargarNoticias();

// Actualizar cada 5 minutos (300000 ms)
setInterval(cargarNoticias, 300000);