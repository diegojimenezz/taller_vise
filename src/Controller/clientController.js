const clientService = require("../Services/clientService.js");
const db = require("../Data/db.js");

exports.registerClient = async (req, res) => {
  try {
    const result = await clientService.register(req.body);
    if (!result.valid) {
      return res.status(400).json({ status: "Rejected", error: result.error });
    }
    res.json(result.data);
  } catch (e) {
    res.status(500).json({ status: "Error", error: "Error interno" });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAll();
    res.json(clients);
  } catch (e) {
    res.status(500).json({ status: "Error", error: "Error interno" });
  }
};

exports.getClientById = async (req, res) => {
  const idParam = req.params.id;
  // try to accept both numeric ids (in-memory) and Mongo numeric clientId
  const id = isNaN(Number(idParam)) ? idParam : Number(idParam);

  try {
    const client = await clientService.getById(id);
    if (!client) {
      return res.status(404).json({ status: "Not Found", error: "Cliente no encontrado" });
    }
    res.json(client);
  } catch (e) {
    res.status(500).json({ status: "Error", error: "Error interno" });
  }
};

exports.seedClients = (req, res) => {
  const seeded = db.seed();
  res.json({ seededCount: seeded.length, clients: seeded });
};