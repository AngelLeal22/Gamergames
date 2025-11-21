const router = require('express').Router();

// If you have a payments model, replace this with full logic.
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/payments body:', req.body);
    // For now just echo back the received data
    return res.status(201).json({ message: 'Payment received (stub)', data: req.body });
  } catch (err) {
    console.error('Error in payments POST:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
const payRouter = require('express').Router();
// const Payment = require('../models/payments');

//ENDPOINT

//PARA CREAR UN NUEVO USUARIO

payRouter.post('/', async (req,res) =>{
        //  const {nombre,telefono, cedula,banco,activo} = req.body;
         console.log(req.body)
})



module.exports= payRouter;