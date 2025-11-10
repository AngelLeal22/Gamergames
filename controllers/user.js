const usersRouter = require('express').Router();
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const {PAGE_URL}= require("../config");
const { request } = require('express');

//ENDPOINT

//para crear un nuevo usuario
usersRouter.post('/', async (req, res) =>{
    try {
        const {name, email, password} = req.body;
        console.log(req.body);

        //validacion a nivel de backend
        if (!name || !email || !password) {
                return res.status(400).json({ error: 'Todos los espacions son requeridos' });
        }

        //Encriptacion de contraseñas, antes de guardar con bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const newUser = new User({
                name,
                email,
                passwordHash,
        })

        // guardar el usuario en la base de datos con el metodo .save()
        const savedUser = await newUser.save();

        // para crear el token
        const token = jwt.sign({ id: savedUser.id}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn :"1d"} )
        console.log(token)

        // Responder al cliente con información mínima (evitar estructuras circulares)
        return res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
            token,
        });
    } catch (error) {
        console.error(error);
        // Manejo simple de duplicados (Mongo unique index -> code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
})

module.exports = usersRouter;