const clientService = require("../Services/clientService.js");
const calculateDiscount = require("../utils/discountUtils.js");
const Purchase = require("../models/purchaseModel.js");

exports.createPurchase = async (req, res) => {
  const { clientId, amount, currency, purchaseDate, purchaseCountry } = req.body;

  console.log("Client ID received:", clientId);
  console.log("Clients in database:", clientService.getAll());

  const client = clientService.getById(clientId);
  if (!client) {
    return res.status(404).json({ status: "Rejected", error: "Cliente no encontrado" });
  }

  const validation = clientService.validateRestrictions(client);
  if (!validation.valid) {
    return res.status(400).json({ status: "Rejected", error: validation.error });
  }

  const discountRate = calculateDiscount({ amount, date: purchaseDate, country: purchaseCountry }, client);
  const discount = amount * discountRate;
  const finalAmount = amount - discount;

  const benefit = discountRate > 0 ? `Descuento aplicado: ${discountRate * 100}%` : "Sin beneficios";

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
    await purchase.save();
    res.status(201).json({
      status: "Approved",
      purchase: {
        clientId,
        originalAmount: amount,
        discountApplied: discount,
        finalAmount,
        benefit
      }
    });
  } catch (error) {
    res.status(500).json({ status: "Error", error: "Error al guardar la compra" });
  }
};