const db = require("../Data/db.js");

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

exports.register = (client) => {
  const validation = validateRestrictions(client);
  if (!validation.valid) return { valid: false, error: validation.error };

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

exports.getAll = () => db.clients;
exports.getById = (id) => db.clients.find(c => c.clientId === id);
