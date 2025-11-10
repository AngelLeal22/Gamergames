const shopIcon = document.querySelector("#shop-icon");
const cart = document.querySelector(".cart");
const table = document.querySelector("#table-body");
const tableClear = document.querySelector("#table-clear");
const busqueda = document.querySelector("#barra");
const grid = document.getElementById("gameGrid");
const logoutLink = document.querySelector("#Cs a");
const genreButtons = document.querySelectorAll(".genre-btn");



// 1. DELEGACIÓN DE EVENTOS PARA EL CARRITO (Resuelve botones dinámicos y la imagen)
grid.addEventListener("click", (e) => {
  // Verificamos si el elemento clicado tiene la clase 'game-btn'
  if (e.target.classList.contains("game-btn")) {
    // CORRECCIÓN CLAVE: Usamos .outerHTML para obtener la etiqueta <img> completa
    const img = e.target.parentElement.parentElement.children[0].outerHTML;
    const name = e.target.parentElement.children[0].innerHTML;
    const exist = [...table.children].find(
      (Element) => Element.children[1].innerHTML === name
    );

    if (exist) {
      exist.children[2].innerHTML = Number(exist.children[2].innerHTML) + 1;
    } else {
      const row = document.createElement("tr");

      row.innerHTML = `
            <td>${img}</td>
            <td>${name}</td>
            <td>1</td>
            <td><svg xmlns="http://www.w3.org/2000/svg" fill="none"  class="delete-btn"  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
     </svg>
        </td>
            `;

      row.children[3].addEventListener("click", (e) => {
        e.currentTarget.parentElement.remove();
      });

      table.append(row);
    }
  }
});

shopIcon.addEventListener("click", (e) => {
  cart.classList.toggle("show-cart");
});



// 2. FUNCIÓN DE FILTRADO Y LÓGICA DE GÉNEROS
// Cargar juegos con manejo de errores para que un fallo de red no rompa todo el script
(async () => {
  let juegos = [];
  try {
    const { data } = await axios.get("/api/games");
    juegos = Array.isArray(data) ? [...data] : [];
  } catch (err) {
    console.error("No se pudieron cargar los juegos:", err);
    // Si la petición falla, seguimos con un array vacío para que el resto del script funcione
    juegos = [];
  }




  // FUNCIÓN REUTILIZABLE PARA RENDERIZAR JUEGOS
  function renderGames(
    gamesArray,
    notFoundMessage = "No se encontraron juegos con ese criterio."
  ) {
    grid.innerHTML = ""; // Limpiar el grid

    if (gamesArray.length > 0) {
      gamesArray.forEach((element) => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `
                  <img src="${element.thumbnail}" alt="${element.title}" />
                  <div class="info"> 
                      <h3>${element.title}</h3>
                      <p class="info-game-card">${element.short_description}</p>
                      <br></br>
                      <button class="game-btn">Agregar al Carrito</button>
                  </div>
              `;
        grid.appendChild(card);
      });
    } else {
      grid.innerHTML = `<p id='notFound'>${notFoundMessage}</p>`;
    }
  }




  // LÓGICA DE BÚSQUEDA
  if (busqueda) {
    busqueda.addEventListener("input", (e) => {
      let termino = e.target.value.toLowerCase();
      const juegosFiltrados = juegos.filter((element) =>
        element.title.toLowerCase().includes(termino)
      );
      renderGames(juegosFiltrados, "No se encontraron juegos con ese título.");
    });
  }




  // LÓGICA GENERALIZADA PARA BOTONES DE GÉNERO
  const genreButtonsLocal = document.querySelectorAll(".genre-btn");

  genreButtonsLocal.forEach((button) => {
    button.addEventListener("click", function (e) {
      const genre = e.target.getAttribute("data-genre").toLowerCase();

      let juegosFiltradosPorGenero;

      if (genre === "all") {
        juegosFiltradosPorGenero = juegos;
      } else {
        juegosFiltradosPorGenero = juegos.filter(
          (element) =>
            element.genre && element.genre.toLowerCase().includes(genre)
        );
      }

      const notFoundMsg =
        genre === "all"
          ? "No hay juegos disponibles."
          : `No se encontraron juegos de tipo ${genre.toUpperCase()}.`;

          renderGames(juegosFiltradosPorGenero, notFoundMsg);

          genreButtonsLocal.forEach((btn) => btn.classList.remove("active"));
          this.classList.add("active");
        });
      });
      
      // INICIALIZACIÓN: Renderiza todos los juegos al cargar la página
      renderGames(juegos, "No hay juegos disponibles.");


      //logica para cerrar sesion.
      if (logoutLink) {
        logoutLink.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            await axios.get("/api/logout");
          } catch (err) {
            console.error("Logout failed", err);
          }
          window.location.pathname = "/login";
        });
      }

      //logica para vaciar el carrito
      tableClear.addEventListener("click", e => {
          table.innerHTML= "";
      })
    })();



