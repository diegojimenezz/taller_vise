// Importar la instrumentación de OpenTelemetry al principio del archivo
const otelSDK = require('./instrumentation');
console.log('Intentando iniciar OpenTelemetry...');

const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

const path = require('path');
const clientRoutes = require("./src/Routers/clientRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger for debugging
app.use((req, res, next) => {
	console.log(`[req] ${req.method} ${req.url}`);
	next();
});

// Servir UI estática en /public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta explícita para la raíz que devuelve public/index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Debug route
app.get('/_debug', (req, res) => {
	res.json({ pid: process.pid, url: req.url, headers: req.headers });
});

// Ruta para verificar el estado de OpenTelemetry
app.get('/_otel-status', (req, res) => {
  res.json({ 
    otel: otelSDK ? 'Configurado' : 'No configurado',
    timestamp: new Date().toISOString()
  });
});

// Rutas API
app.use(clientRoutes);

// ==============================
//  CONFIGURACIÓN DE PUERTO
// ==============================

// Puerto por defecto: 443 para producción, 3000 para desarrollo
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 443 : 3000);

// ==============================
//  LEVANTAR SERVIDOR
// ==============================

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || null;

// === Conectar Mongo si existe variable ===
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("MongoDB conectado correctamente");
      app.listen(PORT, () =>
        console.log(`Servidor escuchando en puerto ${PORT}`)
      );
    })
    .catch((err) => {
      console.error("Error conectando a MongoDB:", err.message);
      console.log("Arrancando servidor sin MongoDB...");
      app.listen(PORT, () =>
        console.log(`Servidor escuchando en puerto ${PORT}`)
      );
    });
} else {
  console.log("MONGODB_URI no proporcionado → usando DB en memoria");
  app.listen(PORT, () =>
    console.log(`Servidor escuchando en puerto ${PORT}`)
  );
}