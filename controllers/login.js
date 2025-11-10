const loginRouter= require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


loginRouter.post("/", async (req,res) =>{
    // aceptar login por email o por nombre de usuario (name)
    const { email, name, password } = req.body;
    const query = {};
    if (email) query.email = email;
    else if (name) query.name = name;
    else return res.status(400).json({ error: 'Email o nombre son requeridos' });

    const userExist = await User.findOne(query);


    console.log(  "este es el usuario existente", userExist)
   

    //para comprobar que los datos del usuario son los correctos
    //email o contraseña
    if(!userExist){
        return  res.status(400).json({error:"email o contraseña invalida"})
    }
    //email
    if (!userExist.verified) {
        return res.status(400).json({error:"Tu email no ha sido verificado"})
    }

    //contraseña  necesitos importa bcrypt y usamos el metodo bcrypt.compare

    
     const isCorrect = await bcrypt.compare(password, userExist.passwordHash)
    
    if (!isCorrect) {
         return  res.status(400).json({ error:"Email o contraseña invalida"})
    }

    const userForToken = {
        id: userExist.id,
    }
    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d"
    })
     
    // para expirar los tokens en las cookies primero van milisegundos*segundos*horas*dias
    res.cookie("accessToken", accessToken , {
        expires: new Date(Date.now()+ 1000 *60 *60* 24),
        secure: process.env.NODE_ENV === "production",
        // httpOnly lo que hace es que no se pueda acceder a la cookie desde el frontend
        httpOnly: true
    });
    return res.sendStatus(200)

});

// GET /status -> comprueba si el usuario tiene una sesión válida vía cookie
loginRouter.get('/status', async (req, res) => {
    try {
        const cookieHeader = req.headers?.cookie || '';
        const match = cookieHeader.split(';').map(c => c.trim()).find(c => c.startsWith('accessToken='));
        if (!match) return res.status(401).json({ error: 'No autenticado' });
        const token = match.split('=')[1];
        const secret = process.env.ACCESS_TOKEN_SECRET || 'devsecret';
        const decoded = jwt.verify(token, secret);
        if (!decoded?.id) return res.status(401).json({ error: 'Token inválido' });
        const user = await User.findById(decoded.id).select('id name email');
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
        return res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        console.error('Status check error', error.message || error);
        return res.status(401).json({ error: 'No autenticado' });
    }
});


module.exports = loginRouter