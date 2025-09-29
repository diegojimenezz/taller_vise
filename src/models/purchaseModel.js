const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  country: {
    type: String,
    required: true
  },
  cardType: {
    type: String,
    enum: ['Classic', 'Gold', 'Platinum', 'Black', 'White'],
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);