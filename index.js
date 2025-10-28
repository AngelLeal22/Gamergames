const app =require("./app")
//recreamos nuestro http

const http = require("http")
const server = http.createServer(app); //importamos app para que viva en nuestro servidor 

//puerto en el cual el servidor escuchara

server.listen(3000, () =>{
    console.log("El servidor esta corriendo")
})