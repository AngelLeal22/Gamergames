// ====================================================
// VARIABLES DEL DOM
// ====================================================

// Carrito y Juegos (EXISTENTE)
const shopIcon = document.querySelector("#shop-icon");
const cart = document.querySelector(".cart");
const table = document.querySelector("#table-body"); // tbody del carrito pequeño
const tableClear = document.querySelector("#table-clear");
const busqueda = document.querySelector("#barra");
const grid = document.getElementById("gameGrid");
const logoutLink = document.querySelector("#Cs a");

// Panel de Administración de Pagos (NUEVO)
const formPayment = document.querySelector("#form"); // ID del formulario de pagos
const paymentTableBody = document.querySelector("#payment-table-body"); // tbody de la tabla de pagos
const saveButton = document.querySelector("#gu"); // Botón Guardar
const cancelButton = document.querySelector("#cancel-edit-btn"); 

// Inputs del formulario de pagos (NUEVO)
const paymentIdInput = document.querySelector("#payment-id-input");
const paymentNameInput = document.querySelector("#payment-name-input");
const paymentPhoneInput = document.querySelector("#payment-phone-input");
const paymentCedulaInput = document.querySelector("#payment-cedula-input");
const paymentBankInput = document.querySelector("#payment-bank-input");
const paymentEmailInput = document.querySelector("#payment-email-input");
const paymentActiveInput = document.querySelector("#payment-active-input");

// ====================================================
// FUNCIONES DE PAGOS (CRUD)
// ====================================================

/**
 * 1. READ: Obtiene los métodos de pago de la API y los renderiza en la tabla.
 */
async function fetchAndRenderPayments() {
    try {
        // Asumiendo que el endpoint para leer es "api/payments"
        const response = await axios.get("api/payments");
        const payments = Array.isArray(response.data) ? response.data : [];
        
        paymentTableBody.innerHTML = ''; // Limpiar la tabla
        
        if (payments.length === 0) {
            paymentTableBody.innerHTML = '<tr><td colspan="8" class="no-payments" style="text-align: center; color: #75B624; padding: 20px;">No hay métodos de pago registrados.</td></tr>';
            return;
        }

        payments.forEach(payment => {
            const row = document.createElement("tr");
            // Muestra un ícono o texto para el estado activo
            const isActive = payment.activo 
                ? '<span style="color: #75B624; font-weight: bold;">✔</span>' 
                : '<span style="color: #ff4d4d; font-weight: bold;">✖</span>'; 

            row.innerHTML = `
                <td>${payment.nombre}</td>
                <td>${payment.telefono}</td>
                <td>${payment.cedula}</td>
                <td>${payment.banco}</td>
                <td>${payment.correo}</td>
                <td style="text-align: center;">${isActive}</td>
                <td>
                    <button class="edit-btn" data-id="${payment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
                <td>
                    <button class="delete-btn" data-id="${payment.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"></path></svg>
                    </button>
                </td>
            `;
            // Almacenamos los datos completos en el dataset para usarlos en la edición
            row.dataset.payment = JSON.stringify(payment); 
            paymentTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error al cargar los métodos de pago:", error);
        paymentTableBody.innerHTML = '<tr><td colspan="8" class="error-load" style="text-align: center; color: #ff4d4d; padding: 20px;">Error al cargar la lista de pagos.</td></tr>';
    }
}


/**
 * 2. CREATE/UPDATE: Maneja el envío del formulario para crear o actualizar un pago.
 */
formPayment.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Recolectar datos del formulario
    const data = {
        nombre: paymentNameInput.value,
        telefono: paymentPhoneInput.value,
        cedula: paymentCedulaInput.value,
        banco: paymentBankInput.value,
        correo: paymentEmailInput.value,
        activo: paymentActiveInput.checked, // Envía true o false
    };
    
    const paymentId = paymentIdInput.value;
    
    try {
        if (paymentId) {
            // Lógica de EDICIÓN (PUT)
            await axios.put(`api/payments/${paymentId}`, data);
            alert("Método de pago actualizado exitosamente.");
        } else {
            // Lógica de CREACIÓN (POST)
            await axios.post("api/payments", data);
            alert("Método de pago agregado exitosamente.");
        }
        
        // Limpiar formulario y recargar datos
        formPayment.reset();
        paymentIdInput.value = ''; // Resetear ID oculto
        saveButton.textContent = 'Guardar';
        cancelButton.classList.add('hidden'); // Ocultar botón cancelar
        await fetchAndRenderPayments();

    } catch (error) {
        console.error("Error al guardar el método de pago:", error);
        alert(`Error al guardar: ${error.response && error.response.data ? error.response.data.message : 'Verifique la conexión o el formato de los datos.'}`);
    }
});

/**
 * 3. UPDATE (Parte 1): Carga los datos de una fila al formulario para su edición.
 */
function loadPaymentForEdit(paymentData) {
    paymentIdInput.value = paymentData.id;
    paymentNameInput.value = paymentData.nombre;
    paymentPhoneInput.value = paymentData.telefono;
    paymentCedulaInput.value = paymentData.cedula;
    paymentBankInput.value = paymentData.banco;
    paymentEmailInput.value = paymentData.correo;
    paymentActiveInput.checked = paymentData.activo;

    saveButton.textContent = 'ACTUALIZAR MÉTODO';
    cancelButton.classList.remove('hidden');
}

/**
 * 4. DELETE: Elimina un método de pago.
 */
async function deletePayment(id) {
    if (!confirm("¿Está seguro de que desea eliminar este método de pago?")) {
        return;
    }
    try {
        // Asumiendo que el endpoint para eliminar es DELETE api/payments/:id
        await axios.delete(`api/payments/${id}`);
        alert("Método de pago eliminado exitosamente.");
        await fetchAndRenderPayments(); // Recargar tabla
    } catch (error) {
        console.error("Error al eliminar el método de pago:", error);
        alert(`Error al eliminar: ${error.response && error.response.data ? error.response.data.message : 'Error de conexión.'}`);
    }
}

/**
 * 5. Eventos de UI Adicionales para el CRUD
 */

// Cancelar Edición: Limpia el formulario y lo vuelve a modo 'Crear'
cancelButton.addEventListener('click', () => {
    formPayment.reset();
    paymentIdInput.value = '';
    saveButton.textContent = 'Guardar';
    cancelButton.classList.add('hidden');
});

// Delegación de eventos para botones de tabla (Editar/Eliminar)
paymentTableBody.addEventListener('click', (e) => {
    const editButton = e.target.closest('.edit-btn');
    const deleteButton = e.target.closest('.delete-btn');
    
    if (editButton) {
        const row = editButton.closest('tr');
        // Convierte la cadena JSON de vuelta a objeto JS
        const paymentData = JSON.parse(row.dataset.payment); 
        loadPaymentForEdit(paymentData);
        // Desplazarse al formulario para la edición
        document.getElementById('form').scrollIntoView({ behavior: 'smooth' });
    } else if (deleteButton) {
        const id = deleteButton.dataset.id;
        deletePayment(id);
    }
});

// ====================================================
// INICIALIZACIÓN Y LÓGICA DE JUEGOS Y CARRITO (EXISTENTE)
// Se mantiene tu lógica original aquí
// ====================================================

// Cargar los pagos al inicio
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderPayments();
});


// **EXISTENTE:** Lógica de abrir y cerrar el carrito pequeño
shopIcon.addEventListener("click", (e) => {
  cart.classList.toggle("show-cart");
});

// **EXISTENTE:** Lógica de Carrito 
grid.addEventListener("click", (e) => {
  // Verificamos si el elemento clicado tiene la clase 'game-btn'
  if (e.target.classList.contains("game-btn")) {
    // CORRECCIÓN CLAVE: Usamos .outerHTML para obtener la etiqueta <img> completa
    const imgElement = e.target.parentElement.parentElement.children[0];
    const img = imgElement ? imgElement.outerHTML : '';
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
      deleteCell.querySelector('.delete-btn').addEventListener("click", (e) => {
        e.currentTarget.closest('tr').remove();
      });
      table.append(row);
    }
  }
});


// **EXISTENTE:** Lógica de filtros y carga de juegos (Preservada)
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

  // lógica para cerrar sesión.
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

  // lógica para vaciar el carrito
  tableClear.addEventListener("click", (e) => {
    table.innerHTML = "";
  });
})();