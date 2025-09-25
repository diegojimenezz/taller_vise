const clientService = require("../Services/clientService.js");
const db = require("../Data/db.js");

exports.registerClient = (req, res) => {
  const result = clientService.register(req.body);

  if (!result.valid) {
    return res.status(400).json({ status: "Rejected", error: result.error });
  }

  res.json(result.data);
};

exports.getAllClients = (req, res) => {
  res.json(clientService.getAll());
};

exports.getClientById = (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ status: "Rejected", error: "ID inválido" });
  }

  const client = clientService.getById(id);

  if (!client) {
    return res.status(404).json({ status: "Not Found", error: "Cliente no encontrado" });
  }

  res.json(client);
};

exports.seedClients = (req, res) => {
  const seeded = db.seed();
  res.json({ seededCount: seeded.length, clients: seeded });
};
