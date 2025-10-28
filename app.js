
const express= require("express");
const mongoose= require("mongoose")
const app = express();
const path = require("path");
require ("dotenv").config();
const axios = require("axios")
const gameRouter = require("./controllers/game");




// funcion que se invoca ah ella misma , donde va la URL de la base de datos
// todo lo que sea con .evn(se le coloca process.env)


(async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log("conectado a MongoDB")
    } catch (error) {
        console.log(error);
    }

})()




//middleware





//RUTAS FRONTED
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/login', express.static(path.resolve('views','login')));
app.use('/singup', express.static(path.resolve('views','singup')));
app.use('/games', express.static(path.resolve('views','games')));
app.use('/images', express.static(path.resolve('images')));


//RUTAS BACKEND
app.use("/api/games", gameRouter);



// funcion que se invoca ah ella misma , donde va la URL de la base de datos
// todo lo que sea con .evn(se le coloca process.env)


(async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST);
        console.log("conectado a MongoDB")
    } catch (error) {
        console.log(error);
    }

})()


module.exports= app;

