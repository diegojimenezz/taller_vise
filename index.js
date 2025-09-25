const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Permite leer JSON en requests

const PORT = 3000;

// Rutas de prueba
app.get("/", (req, res) => {
  res.json({ message: "API VISE funcionando 🚀" });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});