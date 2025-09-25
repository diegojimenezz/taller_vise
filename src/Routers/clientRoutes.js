const express = require("express");
const router = express.Router();
const clientController = require("../Controller/clientController.js");

router.post("/client", clientController.registerClient);
router.get("/clients", clientController.getAllClients);
router.get("/seed", clientController.seedClients);
router.get("/client/:id", clientController.getClientById);

module.exports = router;
