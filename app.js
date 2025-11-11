
const express= require("express");
const mongoose= require("mongoose")
const app = express();
const path = require("path");
require ("dotenv").config();
const axios = require("axios")
const gameRouter = require("./controllers/game");
const usersRouter = require("./controllers/user");
const loginRouter = require('./controllers/login');
const logoutRouter = require("./controllers/logout");
const payRouter = require ("./controllers/payments");
const { MONGO_URI } = require("./config");




// funcion que se invoca ah ella misma , donde va la URL de la base de datos
// todo lo que sea con .evn(se le coloca process.env)


// conectar a MongoDB (usar una sola vez)
(async()=> {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("conectado a MongoDB")
    } catch (error) {
        console.log(error);
    }

})()




//middleware

// permitir parseo de JSON en body (necesario para leer req.body)
app.use(express.json());

// CORS simple para desarrollo: permite peticiones desde otros orígenes (ej. Live Server en :5500)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
        return res.sendStatus(200);
    }
    next();
});






//RUTAS FRONTED
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/login', express.static(path.resolve('views','login')));
app.use('/singup', express.static(path.resolve('views','singup')));
app.use('/games', express.static(path.resolve('views','games')));
app.use('/images', express.static(path.resolve('images')));
app.use('/Components', express.static(path.resolve('views','Components')));
app.use('/admin' , express.static(path.resolve('views','admin')));


//RUTAS BACKEND
app.use("/api/games", gameRouter);
app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/payments', payRouter);



// funcion que se invoca ah ella misma , donde va la URL de la base de datos
// todo lo que sea con .evn(se le coloca process.env)


// (la conexión a MongoDB ya se realizó arriba)


module.exports= app;

