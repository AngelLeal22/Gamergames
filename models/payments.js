const mongoose = require("mongoose");

// Definición del esquema de pagos
const paySchema = new mongoose.Schema({
    nombre: String,
    telefono: String,
    cedula:String,
    Banco:String,
    correo: String,
    activo: Boolean,
    users: [{
        type: mongoose.Schema.Types.ObjectId
    }]
  
});

const Pay = mongoose.model('Pay', paySchema);

module.exports = Pay;


