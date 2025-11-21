const nameInput = document.querySelector("#name-input");
const passwordInput = document.querySelector("#password-input")
const form = document.querySelector("#form")
const errorText = document.querySelector("#error-text")

form.addEventListener("submit", async (e) => {
    // evita que el formulario recargue la página
    e.preventDefault();

    try {
        const user = {
            name: nameInput.value,
            password: passwordInput.value,
        };

        const respuesta = await axios.post("/api/login", user);
        console.log("login response", respuesta && respuesta.status);

        // Si el login fue exitoso (200), redirigimos según el usuario
        if (respuesta && respuesta.status === 200) {
            const isAdmin = String(user.name || "").trim() === "AngelL";
            if (isAdmin) {
                window.location.pathname = "/admin/";
            } else {
                window.location.pathname = "/games/";
            }
        } else {
            if (errorText) errorText.innerHTML = "Credenciales inválidas";
        }
    } catch (error) {
        console.log(error);
        const msg = error?.response?.data?.error || error.message || "Error al iniciar sesión";
        if (errorText) errorText.innerHTML = msg;
    }
});


