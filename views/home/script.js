const shopIcon = document.querySelector("#shop-icon");
const cart = document.querySelector(".cart");
const table = document.querySelector("#table-body");
const gameBtn = document.querySelectorAll(".game-btn");
const tableClear= document.querySelector("#table-clear");





gameBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const img = e.target.parentElement.parentElement.children[0].innerHTML;
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
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" "width: 25px" />
     </svg>
        </td>
            `;


            row.children[3].addEventListener("click" ,e =>{
                e.currentTarget.parentElement.remove()
            })

      table.append(row);
    }
  });
});

shopIcon.addEventListener("click", (e) => {
  cart.classList.toggle("show-cart");
});


tableClear.addEventListener("click", e => {
    table.innerHTML= "";


// Comprar: si el usuario no está autenticado, redirigir a /login
const btnComprar = document.querySelector('#btnC');
if (btnComprar) {
  btnComprar.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      // consultar estado de sesión en el backend
      const resp = await axios.get('/api/login/status');
      if (resp.status === 200) {
        // usuario autenticado -> aquí podrías proceder con la compra
        window.location.pathname = '/games';
      } else {
        window.location.pathname = '/login';
      }
    } catch (err) {
      // no autenticado o error -> llevar a login
      window.location.pathname = '/login';
    }
  });
}
})