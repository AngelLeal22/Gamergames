const guardar = document.querySelector("#gu");
const formulario = document.querySelector("#form")


(async () => { 
    try {
        const info = await axios.get("api/payments");
        console.log(info);
        
    } catch (error) {
        console.error("error");
    }
})();


guardar.addEventListener("click" , e =>{
        console.log("click")
})


formulario.addEventListener("submit", e => {
  console.log("submit")
})