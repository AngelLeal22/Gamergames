const shopIcon = document.querySelector("#shop-icon");
const cart = document.querySelector(".cart");
const table = document.querySelector("#table-body"); // tbody del carrito pequeño
const tableClear = document.querySelector("#table-clear");
const busqueda = document.querySelector("#barra");
const grid = document.getElementById("gameGrid");
const logoutLink = document.querySelector("#Cs a");

// ====================================================
// INICIALIZACIÓN Y LÓGICA DE JUEGOS Y CARRITO (EXISTENTE)
// Se mantiene tu lógica original aquí
// ====================================================

// **EXISTENTE:** Lógica de abrir y cerrar el carrito pequeño
shopIcon.addEventListener("click", (e) => {
  cart.classList.toggle("show-cart");
});

// Logout global handler (works on admin and other pages)
if (logoutLink) {
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await axios.get("/api/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    // Redirect to login page after logout
    window.location.pathname = "/login";
  });
}

// **EXISTENTE:** Lógica de Carrito
if (grid) {
  grid.addEventListener("click", (e) => {
  // Verificamos si el elemento clicado tiene la clase 'game-btn'
  if (e.target.classList.contains("game-btn")) {
    // CORRECCIÓN CLAVE: Usamos .outerHTML para obtener la etiqueta <img> completa
    const imgElement = e.target.parentElement.parentElement.children[0];
    const img = imgElement ? imgElement.outerHTML : "";
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
            <td><svg xmlns="http://www.w3.org/2000/svg" fill="none" class="delete-btn" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg></td>
            `;
      // Se delega la lógica de eliminar para evitar bucles de eventos
      const deleteCell = row.children[3];
      deleteCell.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.currentTarget.closest("tr").remove();
      });
      table.append(row);
    }
  }
  });
}

// **EXISTENTE:** Lógica de filtros y carga de juegos (Preservada)
if (grid) {
  (async () => {
  let juegos = [];
  try {
    // Intenta cargar la lista de juegos
    // Asumiendo que el endpoint es "/api/games"
    const { data } = await axios.get("/api/games");
    juegos = Array.isArray(data) ? [...data] : [];
  } catch (err) {
    console.error("No se pudieron cargar los juegos:", err);
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

  // lógica para cerrar sesión (handler registrado globalmente arriba)

  // lógica para vaciar el carrito
  tableClear.addEventListener("click", (e) => {
    table.innerHTML = "";
  });

  // Close games-related IIFE early if grid exists
  
    // Lógica del CRUD de Métodos de Pago para la Vista de Administrador
    // =================================================================
    })();
  }

// Payment methods UI/CRUD runs regardless of whether the games grid exists
(async () => {
    // 1. SELECTORES del CRUD
    const paymentTableBody = document.querySelector(
      "#payment-methods-table-body"
    );
    const addPaymentBtn = document.querySelector("#add-payment-btn");
    const paymentModal = document.querySelector("#payment-modal");
    const closeModalBtn = document.querySelector("#close-modal-btn");
    const modalTitle = document.querySelector("#modal-title");
    const paymentForm = document.querySelector("#payment-form");
    const methodIdField = document.querySelector("#method-id-field");
    const methodNameField = document.querySelector("#method-name");
    const methodEmailField = document.querySelector("#method-email");
    const methodBankField = document.querySelector("#method-bank");
    const methodAccountField = document.querySelector("#method-account");

    // Endpoint de tu API de Métodos de Pago
    const API_URL = "/api/payment-methods";

    // -----------------------------------------------------
    // 2. FUNCIONES DE INTERACCIÓN CON EL DOM (UI)
    // -----------------------------------------------------

    /** Abre el modal (formulario) para crear o editar. */
    function openModal(isEdit = false, data = {}) {
      paymentForm.reset(); // Limpiar formulario

      if (isEdit) {
        // Modo Edición
        modalTitle.textContent = "Editar Método de Pago";
        // Asume que el ID se llama _id en tu DB
        methodIdField.value = data._id;
        methodNameField.value = data.method;
        methodEmailField.value = data.email;
        methodBankField.value = data.bank || "";
        methodAccountField.value = data.account;
      } else {
        // Modo Creación
        modalTitle.textContent = "Crear Método de Pago";
        methodIdField.value = "";
      }

      // El CSS del modal-backdrop tiene display: flex, por lo que solo cambiamos el display
      paymentModal.style.display = "flex";
    }

    /** Cierra el modal. */
    function closeModal() {
      paymentModal.style.display = "none";
      paymentForm.reset();
    }

    /** Renderiza las filas de la tabla de métodos de pago. (Lógica READ) */
    function renderPaymentMethods(methods) {
      paymentTableBody.innerHTML = ""; // Limpiar tabla

      if (!Array.isArray(methods) || methods.length === 0) {
        paymentTableBody.innerHTML =
          '<tr><td colspan="5">No hay métodos de pago configurados.</td></tr>';
        return;
      }

      methods.forEach((method) => {
        // Asume que cada método tiene un ID único llamado _id
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${method.method}</td>
                <td>${method.email}</td>
                <td>${method.bank || "N/A"}</td>
                <td>${method.account}</td>
                <td>
                    <button class="edit-btn game-btn" data-id="${
                      method._id
                    }">Editar</button>
                    <button class="delete-btn game-btn" data-id="${
                      method._id
                    }">Borrar</button>
                </td>
            `;
        paymentTableBody.appendChild(row);

        // 3. Añadir Listeners de Edición/Borrado
        row
          .querySelector(".edit-btn")
          .addEventListener("click", () => handleEditClick(method));
        row
          .querySelector(".delete-btn")
          .addEventListener("click", () => handleDelete(method._id));
      });
    }

    // -----------------------------------------------------
    // 3. FUNCIONES DE INTERACCIÓN CON EL API (CRUD)
    // -----------------------------------------------------

    /** Trae los métodos de pago del servidor. (READ) */
    async function fetchPaymentMethods() {
      try {
        const response = await axios.get(API_URL);
        renderPaymentMethods(response.data);
      } catch (error) {
        console.error("Error al cargar los métodos de pago:", error);
        paymentTableBody.innerHTML =
          '<tr><td colspan="5" style="color: red;">Error de conexión con el backend.</td></tr>';
      }
    }

    /** Maneja la creación o actualización de un método. (CREATE/UPDATE) */
    async function handleSubmit(e) {
      e.preventDefault();

      const id = methodIdField.value;
      const methodData = {
        method: methodNameField.value,
        email: methodEmailField.value,
        bank: methodBankField.value,
        account: methodAccountField.value,
      };

      try {
        if (id) {
          // Petición PUT para Actualizar (UPDATE)
          await axios.put(`${API_URL}/${id}`, methodData);
          alert("Método de pago actualizado exitosamente.");
        } else {
          // Petición POST para Crear (CREATE)
          // deshabilitar el botón para evitar dobles envíos
          const saveBtn = document.querySelector('#save-method-btn');
          if (saveBtn) saveBtn.disabled = true;

          const resp = await axios.post(API_URL, methodData);
          alert("Método de pago creado exitosamente.");
          console.log('POST /api/payment-methods response:', resp.data);
          if (saveBtn) saveBtn.disabled = false;
        }

        closeModal();
        fetchPaymentMethods(); // Recargar la lista para ver los cambios
      } catch (error) {
          console.error("Error al guardar el método:", error);
          // intentar mostrar mensaje más útil al usuario
          const serverMsg = error?.response?.data?.detail || error?.response?.data?.error || error?.message;
          alert(`Hubo un error al guardar el método de pago. ${serverMsg ? '\nDetalles: ' + serverMsg : ''}`);
          // re-habilitar botón si estaba deshabilitado
          const saveBtn = document.querySelector('#save-method-btn');
          if (saveBtn) saveBtn.disabled = false;
      }
    }

    /** Prepara el modal para la edición con los datos actuales. */
    function handleEditClick(methodData) {
      openModal(true, methodData);
    }

    /** Elimina un método de pago. (DELETE) */
    async function handleDelete(id) {
      if (
        !confirm(
          "¿Estás seguro de que quieres eliminar este método de pago? Esta acción no se puede deshacer."
        )
      ) {
        return;
      }

      try {
        // Petición DELETE
        await axios.delete(`${API_URL}/${id}`);
        alert("Método de pago eliminado exitosamente.");
        fetchPaymentMethods(); // Recargar la lista
      } catch (error) {
        console.error("Error al eliminar el método:", error);
        alert("Hubo un error al eliminar el método de pago.");
      }
    }

    // -----------------------------------------------------
    // 4. LISTENERS DE EVENTOS Y LLAMADA INICIAL
    // -----------------------------------------------------

    // Inicializar la carga de métodos al cargar la página
    fetchPaymentMethods();

    // Event Listeners para el Modal y Formulario
    addPaymentBtn.addEventListener("click", () => openModal(false)); // Abrir para crear
    closeModalBtn.addEventListener("click", closeModal);

    // Cierra si se hace clic en el fondo oscuro del modal
    paymentModal.addEventListener("click", (e) => {
      if (e.target === paymentModal) {
        closeModal();
      }
    });

    paymentForm.addEventListener("submit", handleSubmit);
  })();
