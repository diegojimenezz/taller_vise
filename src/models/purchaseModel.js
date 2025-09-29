const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  // allow flexible clientId: ObjectId when using Mongo, or numeric/string when using in-memory DB
  clientId: {
    type: mongoose.Schema.Types.Mixed,
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
  },
  currency: {
    type: String,
    default: null
  },
  benefit: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);