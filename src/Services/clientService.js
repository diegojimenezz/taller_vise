const db = require("../Data/db.js");
let ClientModel;
try {
  ClientModel = require("../models/clientModel.js");
} catch (e) {
  ClientModel = null;
}

function validateRestrictions(client) {
  const { country, monthlyIncome, viseClub, cardType } = client;

  switch (cardType) {
    case "Classic":
      return { valid: true };

    case "Gold":
      return monthlyIncome >= 500
        ? { valid: true }
        : { valid: false, error: "El cliente no cumple con el ingreso mínimo de 500 USD para Gold" };

    case "Platinum":
      if (monthlyIncome < 1000) return { valid: false, error: "Ingreso mínimo de 1000 USD requerido" };
      if (!viseClub) return { valid: false, error: "Debe tener suscripción VISE CLUB" };
      return { valid: true };

    case "Black":
    case "White":
      if (monthlyIncome < 2000) return { valid: false, error: "Ingreso mínimo de 2000 USD requerido" };
      if (!viseClub) return { valid: false, error: "Debe tener suscripción VISE CLUB" };
      if (["China", "Vietnam", "India", "Irán"].includes(country)) {
        return { valid: false, error: `El cliente con tarjeta ${cardType} no puede residir en ${country}` };
      }
      return { valid: true };

    default:
      return { valid: false, error: "Tipo de tarjeta no válido" };
  }
}

exports.register = async (client) => {
  const validation = validateRestrictions(client);
  if (!validation.valid) return { valid: false, error: validation.error };

  if (ClientModel && ClientModel.db && ClientModel.db.readyState === 1) {
    // Save to MongoDB
    // Usar el siguiente ID disponible si no se proporciona clientId
    const clientId = client.clientId || db.nextClientId++;
    
    const doc = new ClientModel({
      ...client,
      clientId: clientId
    });
    
    const saved = await doc.save();
    return {
      valid: true,
      data: {
        clientId: saved.clientId,
        name: saved.name,
        cardType: saved.cardType,
        status: "Registered",
        message: `Cliente apto para tarjeta ${saved.cardType}`
      }
    };
  }

  // Fallback in-memory
  const newClient = {
    clientId: db.nextClientId++,
    ...client
  };
  db.clients.push(newClient);

  return {
    valid: true,
    data: {
      clientId: newClient.clientId,
      name: newClient.name,
      cardType: newClient.cardType,
      status: "Registered",
      message: `Cliente apto para tarjeta ${newClient.cardType}`
    }
  };
};

exports.getAll = async () => {
  if (ClientModel && ClientModel.db && ClientModel.db.readyState === 1) {
    const docs = await ClientModel.find().lean();
    return docs.map(d => ({ ...d, clientId: d.clientId }));
  }
  // map in-memory clients to ensure clientId is string
  return db.clients.map(c => ({ ...c, clientId: c.clientId }));
};

exports.getById = async (id) => {
  if (ClientModel && ClientModel.db && ClientModel.db.readyState === 1) {
    try {
      // Buscar por clientId numérico
      const d = await ClientModel.findOne({ clientId: id }).lean();
      return d ? { ...d, clientId: d.clientId } : null;
    } catch (e) {
      return null;
    }
  }
  // tolerant lookup: compare as strings so both numeric and string ids work
  return db.clients.find(c => String(c.clientId) === String(id));
};

exports.validateRestrictions = validateRestrictions;