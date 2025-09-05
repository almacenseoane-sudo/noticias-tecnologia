let articulosOriginales = [];

async function cargarNoticias() {
  try {
    const respuesta = await fetch('/api/noticias');
    const datos = await respuesta.json();

    const contenedor = document.getElementById('noticias');
    contenedor.innerHTML = '<p class="cargando">Cargando noticias...</p>';

    if (!datos.articles || datos.articles.length === 0) {
      contenedor.innerHTML = '<p>No se encontraron noticias.</p>';
      return;
    }

    // Guardar artículos originales
    articulosOriginales = datos.articles.slice(0, 20);

    mostrarNoticias(articulosOriginales);
  } catch (error) {
    console.error("Error al cargar noticias:", error);
    document.getElementById('noticias').innerHTML = 
      '<p style="color:red;">Error al cargar las noticias.</p>';
  }
}

function mostrarNoticias(articulos) {
  const contenedor = document.getElementById('noticias');
  contenedor.innerHTML = '';

  if (articulos.length === 0) {
    contenedor.innerHTML = '<p class="no-results">No se encontraron noticias con ese término.</p>';
    return;
  }

  articulos.forEach(noticia => {
    // Imagen segura
    const imagen = noticia.urlToImage 
      ? noticia.urlToImage 
      : "https://via.placeholder.com/400x200?text=Sin+imagen";

    // Fuente del sitio
    const fuente = noticia.source?.name || 'Fuente desconocida';

    contenedor.innerHTML += `
      <article class="noticia">
        <img src="${imagen}" alt="${noticia.title}" onerror="this.src='https://via.placeholder.com/400x200?text=Error+imagen'">
        <div class="contenido">
          <h2 class="titulo">
            <a href="${noticia.url}" target="_blank">${noticia.title}</a>
          </h2>
          <p class="descripcion">${noticia.description || 'Sin descripción.'}</p>
          <p class="fecha">${new Date(noticia.publishedAt).toLocaleString('es-ES')}</p>
          <p class="fuente">Fuente: ${fuente}</p>
        </div>
      </article>
    `;
  });
}

function filtrarNoticias() {
  const termino = document.getElementById('buscador').value.toLowerCase();
  if (!termino) {
    mostrarNoticias(articulosOriginales);
    return;
  }

  const filtrados = articulosOriginales.filter(noticia =>
    noticia.title.toLowerCase().includes(termino) ||
    noticia.description?.toLowerCase().includes(termino)
  );

  mostrarNoticias(filtrados);
}

function cambiarTema() {
  const html = document.documentElement;
  const esOscuro = html.getAttribute('data-theme') === 'dark';
  
  if (esOscuro) {
    html.setAttribute('data-theme', 'light');
    document.getElementById('modo-oscuro').textContent = '🌙 Modo Oscuro';
  } else {
    html.setAttribute('data-theme', 'dark');
    document.getElementById('modo-oscuro').textContent = '☀️ Modo Claro';
  }
}

// Cargar al inicio
cargarNoticias();

// Actualizar cada 5 minutos
setInterval(cargarNoticias, 300000);