const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  method: { type: String, required: true },
  email: { type: String, required: true },
  bank: { type: String },
  account: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
