const router = require('express').Router();
const PaymentMethod = require('../models/paymentMethod');

// GET /api/payment-methods - list all
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/payment-methods called');
    const methods = await PaymentMethod.find({}).sort({ createdAt: -1 });
    res.json(methods);
  } catch (err) {
    console.error('GET /api/payment-methods error', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Error fetching payment methods', detail: err && err.message });
  }
});

// POST /api/payment-methods - create
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/payment-methods body:', req.body);
    const { method, email, bank, account } = req.body || {};
    if (!method || !email || !account) {
      return res.status(400).json({ error: 'method, email and account are required' });
    }
    const pm = new PaymentMethod({ method, email, bank, account });
    const saved = await pm.save();
    console.log('Created payment method id=', saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/payment-methods error', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Error creating payment method', detail: err && err.message });
  }
});

// PUT /api/payment-methods/:id - update
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { method, email, bank, account } = req.body || {};
    const updated = await PaymentMethod.findByIdAndUpdate(id, { method, email, bank, account }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/payment-methods/:id error', err);
    res.status(500).json({ error: 'Error updating payment method' });
  }
});

// DELETE /api/payment-methods/:id - delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await PaymentMethod.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /api/payment-methods/:id error', err);
    res.status(500).json({ error: 'Error deleting payment method' });
  }
});

module.exports = router;
