const mongoose = require("mongoose");

//CON EL SCHEMA DEFINIMOS LA ESTRUCTURA DE LA COLECCION DE LOS USUARIOS Y EL TIPO DE DATO
const gameSchema = new mongoose.Schema({
    id: number,
    titulo: String,
    thumbnail:String,
    short_description: String,
    game_url: String,
    genre: String,
    platform: String,
    publisher: String,
    developer: String,
    release_date: String,
    freetogame_profile_url:String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
  
});