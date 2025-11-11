const nameInput = document.querySelector("#name-input");
const passwordInput = document.querySelector("#password-input")
const form = document.querySelector("#form")
const errorText = document.querySelector("#error-text")

form.addEventListener("submit",async  e =>{
    // el e.preventdefault() sirve para que no se recargue la pagina
    e.preventDefault()
    try {
        const user = {
            name: nameInput.value,
            password: passwordInput.value
            }
            console.log( "este es el user en el login", user);
            const respuesta = await axios.post("/api/login",user);
            console.log(respuesta)
            if (user.name ==! "AngelL") {
            
                window.location.pathname = `/games/`
                
            }
            else{
               window.location.pathname = `/admin/` 
            }
  
        
    } catch (error) {
        console.log(error)
        errorText.innerHTML = error.response.data.error
    }
        })


