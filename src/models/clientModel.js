const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientId: { type: Number, required: true },
  name: { type: String, required: true },
  country: { type: String },
  monthlyIncome: { type: Number, default: 0 },
  viseClub: { type: Boolean, default: false },
  cardType: { type: String, enum: ['Classic', 'Gold', 'Platinum', 'Black', 'White'], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create a compound index instead of a unique index on clientId
clientSchema.index({ clientId: 1 });

// Expose virtual `id` to match in-memory shape
clientSchema.virtual('id').get(function() {
  return this.clientId;
});

clientSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Client', clientSchema);