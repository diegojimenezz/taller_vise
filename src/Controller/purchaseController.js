const clientService = require("../Services/clientService.js");
const calculateDiscount = require("../utils/discountUtils.js");
const Purchase = require("../models/purchaseModel.js");


const db = require("../Data/db.js");

exports.createPurchase = async (req, res) => {
  const { clientId, amount, currency, purchaseDate, purchaseCountry } = req.body;

  console.log("Client ID received:", clientId);

  try {
    const allClients = await clientService.getAll();
    console.log("Clients in database:", allClients);
  } catch (e) {
    console.log('No se pudo obtener lista de clientes:', e.message);
  }

  const client = await clientService.getById(clientId);

  if (!client) {
    return res.status(404).json({ status: "Rejected", error: "Cliente no encontrado" });
  }

  const validation = clientService.validateRestrictions(client);
  if (!validation.valid) {
    return res.status(400).json({ status: "Rejected", error: validation.error });
  }


  const discountInfo = calculateDiscount({ amount, date: purchaseDate, country: purchaseCountry }, client);
  const discount = Number(amount) * (discountInfo.rate || 0);
  const finalAmount = amount - discount;
  const benefit = discountInfo.rate > 0 ? `${discountInfo.reason} - Descuento ${Math.round(discountInfo.rate * 100)}%` : "Sin beneficios";

  const purchase = new Purchase({
    clientId,
    amount,
    date: purchaseDate,
    country: purchaseCountry,
    cardType: client.cardType,
    discount,
    finalAmount
  });

  try {
    if (Purchase && Purchase.db && Purchase.db.readyState === 1) {
      // attach currency and benefit
      purchase.currency = currency;
      purchase.benefit = benefit;
      await purchase.save();
      // return normalized response using saved document values
      return res.status(201).json({
        status: "Approved",
        purchase: {
          clientId: String(client.clientId || client._id || clientId),
          originalAmount: Number(amount),
          discountApplied: discount,
          finalAmount: Number(finalAmount),
          benefit
        }
      });
    }

    // fallback to in-memory DB
    const saved = {
      purchaseId: db.nextPurchaseId++,
      clientId: String(client.clientId || client._id || clientId),
      amount: Number(amount),
      currency: currency || null,
      date: purchaseDate,
      country: purchaseCountry,
      cardType: client.cardType,
      discount,
      finalAmount: Number(finalAmount),
      benefit
    };
    db.purchases.push(saved);

    // Respond normalized
    res.status(201).json({
      status: "Approved",
      purchase: {
        clientId: saved.clientId,
        originalAmount: saved.amount,
        discountApplied: saved.discount,
        finalAmount: saved.finalAmount,
        benefit: saved.benefit
      }
    });
  } catch (error) {
    res.status(500).json({ status: "Error", error: "Error al guardar la compra" });
  }
};

// GET /purchases - list all purchases (Mongo if available, else in-memory)
exports.getAllPurchases = async (req, res) => {
  try {
    if (Purchase && Purchase.db && Purchase.db.readyState === 1) {
      const list = await Purchase.find().lean();
      // Mapear los campos para que coincidan con lo que espera el frontend
      const mapped = list.map(p => ({
        purchaseId: p._id,
        clientId: p.clientId,
        originalAmount: p.amount,
        discountApplied: p.discount,
        finalAmount: p.finalAmount,
        currency: p.currency || null,
        benefit: p.benefit || null,
        date: p.date,
        country: p.country,
        cardType: p.cardType
      }));
      return res.status(200).json({ status: "Approved", purchases: mapped });
    }

    const mapped = (db.purchases || []).map(p => ({
      purchaseId: p.purchaseId || p._id,
      clientId: p.clientId,
      originalAmount: p.amount,
      discountApplied: p.discount,
      finalAmount: p.finalAmount,
      currency: p.currency || null,
      benefit: p.benefit || null,
      date: p.date,
      country: p.country,
      cardType: p.cardType
    }));

    return res.status(200).json({ status: "Approved", purchases: mapped });
  } catch (e) {
    return res.status(500).json({ status: "Error", error: "Error al obtener compras" });
  }
};

// GET /purchases/client/:clientId - purchases for a specific client
exports.getPurchasesByClient = async (req, res) => {
  const { clientId } = req.params;
  try {
    if (Purchase && Purchase.db && Purchase.db.readyState === 1) {
      // Query by clientId; try both string and number versions to handle type differences
      const list = await Purchase.find({ 
        $or: [
          { clientId: clientId },
          { clientId: parseInt(clientId) }
        ]
      }).lean();
      // Mapear los campos para que coincidan con lo que espera el frontend
      const mapped = list.map(p => ({
        purchaseId: p._id,
        clientId: p.clientId,
        originalAmount: p.amount,
        discountApplied: p.discount,
        finalAmount: p.finalAmount,
        currency: p.currency || null,
        benefit: p.benefit || null,
        date: p.date,
        country: p.country,
        cardType: p.cardType
      }));
      return res.status(200).json({ status: "Approved", purchases: mapped });
    }

    const results = (db.purchases || []).filter(p => String(p.clientId) === String(clientId));
    const mapped = results.map(p => ({
      purchaseId: p.purchaseId || p._id,
      clientId: p.clientId,
      originalAmount: p.amount,
      discountApplied: p.discount,
      finalAmount: p.finalAmount,
      currency: p.currency || null,
      benefit: p.benefit || null,
      date: p.date,
      country: p.country,
      cardType: p.cardType
    }));
    return res.status(200).json({ status: "Approved", purchases: mapped });
  } catch (e) {
    return res.status(500).json({ status: "Error", error: "Error al obtener compras por cliente" });
  }
};