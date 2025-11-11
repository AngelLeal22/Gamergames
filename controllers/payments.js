const payRouter = require('express').Router();
// const Payment = require('../models/payments');

//ENDPOINT

//PARA CREAR UN NUEVO USUARIO

payRouter.post('/', async (req,res) =>{
        //  const {nombre,telefono, cedula,banco,activo} = req.body;
         console.log(req.body)
})



module.exports= payRouter;