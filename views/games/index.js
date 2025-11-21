// =====================
// SELECTORES DEL DOM (declarados arriba para accesibilidad global)
// =====================
 
const shopIcon = document.querySelector("#shop-icon");
const cart = document.querySelector(".cart");
const table = document.querySelector("#table-body"); // tbody del carrito pequeño
const tableClear = document.querySelector("#table-clear");
const busqueda = document.querySelector("#barra");
const grid = document.getElementById("gameGrid");
const logoutLink = document.querySelector("#Cs a");
const genreButtons = document.querySelectorAll(".genre-btn");

// Botón principal de compra (usado en carrito pequeño y también en otros lugares)
const btnComprar = document.querySelector("#btnC");
// Alias por compatibilidad (algunas partes del código usan btnC)
const btnC = document.querySelector("#btnC");

// Elementos del modal de checkout (resumen) y el modal de compra (detalles)
const checkoutModal = document.querySelector("#checkout-modal");
const closeCheckoutBtn = document.querySelector("#close-checkout-modal");
const checkoutTableBody = document.querySelector("#checkout-table-body");
const finalCheckoutTotal = document.querySelector("#final-checkout-total");

// Elementos del modal de compra específico (selección y detalles del método)
const purchaseModal = document.querySelector("#purchase-modal");
const closePurchaseModalBtn = document.querySelector("#close-purchase-modal-btn");
const paymentSelect = document.querySelector("#payment-select");
const selectedMethodDetails = document.querySelector("#selected-method-details");
// El HTML actual puede usar alguno de estos ids para el botón final
const confirmPurchaseBtn = document.querySelector("#complete-purchase-btn");

// Selectores del resumen rápido del checkout
const checkoutSelect = document.querySelector('#payment-method-select');
const checkoutSummary = document.querySelector('#selected-method-summary');

// Datos y endpoint
let allPayments = [];
const API_URL = '/api/payment-methods';



confirmPurchaseBtn.addEventListener("click",  (e) => {

  //para cuando le damos click aparezca el mensaje de exito
  e.preventDefault();
  alert("¡Compra completada con éxito! Gracias por tu compra.");
  console.log(confirmPurchaseBtn)
   closePurchaseModal()
});


// -------------------------------
// FUNCIONES DE MÉTODOS DE PAGO (definidas en ámbito global del script)
// -------------------------------
/** Carga los métodos de pago y llena el dropdown en el modal de compra. */
async function fetchAndPopulatePaymentMethods() {
  try {
    const response = await axios.get(API_URL);
    allPayments = Array.isArray(response.data) ? response.data : [];
    renderPaymentSelect(allPayments);

  // También poblar el select del checkout (resumen rápido)
  // usamos los selectores definidos arriba: checkoutSelect, checkoutSummary
  if (checkoutSelect) {
      // limpiar
      checkoutSelect.innerHTML = '<option value="" disabled selected>-- Elige un método --</option>';
      if (allPayments.length === 0) {
        checkoutSelect.innerHTML += '<option disabled>No hay métodos disponibles</option>';
      } else {
        allPayments.forEach(pm => {
          const opt = document.createElement('option');
          opt.value = pm._id;
          opt.textContent = `${pm.method} (${pm.email})`;
          checkoutSelect.appendChild(opt);
        });
      }

      // listener para mostrar resumen (segestiona para no duplicar)
      if (checkoutSelect._listener) checkoutSelect.removeEventListener('change', checkoutSelect._listener);
      const listener = (e) => {
        const id = e.target.value;
        const m = allPayments.find(x => String(x._id) === String(id));
        if (checkoutSummary) {
          if (m) {
            checkoutSummary.innerHTML = `
              <strong>${m.method}</strong> — ${m.email} ${m.bank ? `| Banco: ${m.bank}` : ''} ${m.account ? `| Cuenta: ${m.account}` : ''}
            `;
          } else {
            checkoutSummary.innerHTML = '<p class="error-msg">Método no encontrado.</p>';
          }
        }
      };
      checkoutSelect.addEventListener('change', listener);
      checkoutSelect._listener = listener;
    }

  } catch (error) {
    console.error("Error al cargar los métodos de pago:", error);
    if (selectedMethodDetails) selectedMethodDetails.innerHTML = "<p class='error-msg'>Error al cargar los métodos de pago.</p>";
  }
}

/** Llena el select del modal de compra con los métodos activos. */
function renderPaymentSelect(methods) {
  if (!paymentSelect) return;
  // Limpiamos el select, manteniendo la opción por defecto
  paymentSelect.innerHTML = '<option value="" disabled selected>-- Elige un método --</option>';

  const available = Array.isArray(methods) ? methods : [];
  if (available.length === 0) {
    paymentSelect.innerHTML += '<option disabled>No hay métodos de pago disponibles</option>';
    if (confirmPurchaseBtn) confirmPurchaseBtn.disabled = true;
    return;
  }

  available.forEach(pm => {
    const option = document.createElement("option");
    option.value = pm._id;
    option.textContent = `${pm.method} (${pm.email})`;
    paymentSelect.appendChild(option);
  });

  if (confirmPurchaseBtn) confirmPurchaseBtn.disabled = true; // Deshabilitar inicialmente
}

/** Muestra la información del método seleccionado en la casilla de detalles. */
function displayPaymentDetails(methodId) {
  if (!selectedMethodDetails) return;
  if (!methodId) {
    selectedMethodDetails.innerHTML = "<p>Selecciona un método para ver los detalles de pago (cuenta, correo, etc.).</p>";
    if (confirmPurchaseBtn) confirmPurchaseBtn.disabled = true;
    return;
  }

  const method = allPayments.find(m => String(m._id) === String(methodId));
  if (method) {
    selectedMethodDetails.innerHTML = `
      <h4>Detalles de Pago para ${method.method}</h4>
      <ul>
        <li><strong>Método:</strong> ${method.method}</li>
        <li><strong>Correo/Usuario:</strong> ${method.email}</li>
        ${method.bank ? `<li><strong>Banco:</strong> ${method.bank}</li>` : ''}
        <li><strong>Cuenta/Teléfono:</strong> ${method.account}</li>
      </ul>
      <p class="instruction">Instrucción: Transfiere el monto total a los datos indicados y luego presiona "Confirmar Pago".</p>
    `;
    if (confirmPurchaseBtn) confirmPurchaseBtn.disabled = false;
  } else {
    selectedMethodDetails.innerHTML = "<p class='error-msg'>Método de pago no encontrado.</p>";
    if (confirmPurchaseBtn) confirmPurchaseBtn.disabled = true;
  }
}


// -----------------------------------------------------
// 2. LÓGICA DEL MODAL DE COMPRA Y ESCUCHADORES
// -----------------------------------------------------
function openPurchaseModal() {
  if (purchaseModal) purchaseModal.style.display = 'flex';
  if (allPayments.length === 0) fetchAndPopulatePaymentMethods();
}

function closePurchaseModal() {
  if (purchaseModal) purchaseModal.style.display = 'none';
  if (paymentSelect) paymentSelect.value = '';
  displayPaymentDetails(null);
}

// --- fin de ayudas (helpers) de métodos de pago ---





// 1. DELEGACIÓN DE EVENTOS PARA EL CARRITO (Resuelve botones dinámicos y la imagen)
grid.addEventListener("click", (e) => {
  // Verificamos si el elemento clicado tiene la clase 'game-btn'
  if (e.target.classList.contains("game-btn")) {
    // Corregido: La imagen debe ser un HTML completo con el src correcto
    const card = e.target.closest('.game-card');
    const imgElement = card.querySelector('img');
    const name = card.querySelector('h3').innerHTML;
    // Asumimos un precio base, idealmente deberías obtenerlo de los datos
    const price = 20.34; 
    
    // El outerHTML de la imagen funciona para transferir la imagen
    const imgHTML = imgElement ? imgElement.outerHTML : ''; 

    const exist = [...table.children].find(
      (Element) => Element.children[1].innerHTML === name
    );

    if (exist) {
      // Aumentar la cantidad en el carrito pequeño
      const qtyElement = exist.children[2];
      qtyElement.innerHTML = Number(qtyElement.innerHTML) + 1;
    } else {
      const row = document.createElement("tr");

      row.innerHTML = `
            <td>${imgHTML}</td>
            <td>${name}</td>
            <td data-price="${price}">1</td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="delete-btn" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </td>
            `;
            
      // Se delega la lógica de eliminar para evitar bucles de eventos
      const deleteCell = row.children[3];
      deleteCell.querySelector('.delete-btn').addEventListener("click", (e) => {
        e.currentTarget.closest('tr').remove();
        // Opcional: Actualizar el total si tienes un total en el carrito pequeño
      });

      table.append(row);
    }
  }
});

// Lógica de abrir y cerrar el carrito pequeño
shopIcon.addEventListener("click", (e) => {
  cart.classList.toggle("show-cart");
});

// ----------------------------------------------------
// 🛑 LÓGICA DEL MODAL DE COMPRA (CHECKOUT) 🛑
// ----------------------------------------------------

// Función para calcular y mostrar el total (necesita ser mejorada con datos reales)
function updateCheckoutTotal() {
    let total = 0;
    // Iterar sobre las filas en el modal
    [...checkoutTableBody.children].forEach(row => {
        const qty = Number(row.querySelector('.qty-display').textContent);
        // Asumimos que el precio está guardado en un atributo de la fila o se obtiene del servidor
        // Por ahora, usaremos un precio ficticio de $59.99 por juego para la demostración
        const pricePerItem = 59.99; 
        
        total += qty * pricePerItem;
    });
    
    // Formatear y mostrar el total
    finalCheckoutTotal.textContent = `$${total.toFixed(2)}`;
    return total;
}

// Lógica para transferir ítems del carrito pequeño al modal
btnComprar.addEventListener("click", () => {
    // 1. Ocultar el carrito pequeño y mostrar el modal
    cart.classList.remove("show-cart");
    checkoutModal.classList.remove("hidden");
    
    // 2. Limpiar el modal antes de llenarlo
    checkoutTableBody.innerHTML = '';
    
    // 3. Transferir ítems
    if (table.children.length === 0) {
        checkoutTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Tu carrito está vacío.</td></tr>';
        updateCheckoutTotal();
        return;
    }
    
    [...table.children].forEach(cartRow => {
        const imgHTML = cartRow.children[0].innerHTML;
        const name = cartRow.children[1].innerHTML;
        const initialQty = Number(cartRow.children[2].innerHTML);
        // Usamos un ID temporal o el nombre como clave para la demostración
        const itemId = name.replace(/\s/g, '_'); 

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${imgHTML}</td>
            <td class="checkout-col-name">${name}</td>
            <td class="checkout-col-qty">
                <div class="qty-controls">
                    <button class="qty-btn qty-minus" data-id="${itemId}">-</button>
                    <span class="qty-display">${initialQty}</span>
                    <button class="qty-btn qty-plus" data-id="${itemId}">+</button>
                </div>
            </td>
            <td class="checkout-col-price">$${(59.99 * initialQty).toFixed(2)}</td>
            <td class="checkout-col-del">
                <button class="delete-item-btn" data-id="${itemId}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg></button>
            </td>
        `;
        checkoutTableBody.appendChild(row);
    });
    
    updateCheckoutTotal();
  // Cargar métodos de pago para poblar el selector del checkout
  try {
    fetchAndPopulatePaymentMethods();
  } catch (err) {
    console.error('Error cargando métodos al abrir checkout:', err);
  }
});

// Lógica para cerrar el modal
closeCheckoutBtn.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
});

// Delegación de eventos para controles CRUD en el Modal
checkoutTableBody.addEventListener('click', (e) => {
    const target = e.target;
    const row = target.closest('tr');
    
    if (!row) return; // Si no estamos en una fila, salimos.

    // Botón de Eliminar
    if (target.closest('.delete-item-btn')) {
        row.remove();
        // Opcional: Eliminar también del carrito pequeño si es necesario
        updateCheckoutTotal();
    }
    
    // Controles de Cantidad
    const qtyDisplay = row.querySelector('.qty-display');
    let currentQty = Number(qtyDisplay.textContent);

    if (target.classList.contains('qty-plus')) {
        currentQty += 1;
        qtyDisplay.textContent = currentQty;
        // Opcional: Actualizar el subtotal de la fila
        updateCheckoutTotal();
    } else if (target.classList.contains('qty-minus') && currentQty > 1) {
        currentQty -= 1;
        qtyDisplay.textContent = currentQty;
        // Opcional: Actualizar el subtotal de la fila
        updateCheckoutTotal();
    }
    
    // Si la cantidad llega a 0, se podría eliminar la fila:
    if (currentQty === 0) {
        row.remove();
        updateCheckoutTotal();
    }
});


// ... (Resto del código de carga de juegos, filtros y logout) ...

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
  tableClear.addEventListener("click", (e) => {
    table.innerHTML = "";




// -----------------------------------------------------
// 2. LÓGICA DEL MODAL DE COMPRA Y ESCUCHADORES
// -----------------------------------------------------

// Las funciones `openPurchaseModal` y `closePurchaseModal` están
// definidas al inicio del archivo para evitar duplicidad.

// Escuchar el cambio en el selector de métodos
paymentSelect.addEventListener("change", (e) => {
    displayPaymentDetails(e.target.value);
});

// Escuchadores de eventos para el Modal de Compra
if (btnC) {
    btnC.addEventListener("click", (e) => {
        e.preventDefault();
        openPurchaseModal();
    });
}
if (closePurchaseModalBtn) {
    closePurchaseModalBtn.addEventListener("click", closePurchaseModal);
}
// Cierra si se hace clic en el fondo oscuro
if (purchaseModal) {
    purchaseModal.addEventListener("click", (e) => {
        if (e.target === purchaseModal) {
            closePurchaseModal();
        }
    });
}
// cuando le damos al botond de completar compra se muestre un mensaje de exito

confirmPurchaseBtn.addEventListener("click", async (e) => {
  //para cuando le damos click aparezca el mensaje de exito
    e.preventDefault();
    alert("¡Compra completada con éxito! Gracias por tu compra.");
   
});








 });
})();