const express = require("express");
const router = express.Router();
const clientController = require("../Controller/clientController.js");
const purchaseController = require("../Controller/purchaseController.js");

router.post("/client", clientController.registerClient);
router.get("/clients", clientController.getAllClients);
router.get("/seed", clientController.seedClients);
router.get("/client/:id", clientController.getClientById);
router.post("/purchase", purchaseController.createPurchase);
router.get('/purchases', purchaseController.getAllPurchases);
router.get('/purchases/client/:clientId', purchaseController.getPurchasesByClient);

module.exports = router;
