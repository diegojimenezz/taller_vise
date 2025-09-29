const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');


const path = require('path');
const clientRoutes = require("./src/Routers/clientRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Force CSP header on all responses by wrapping writeHead (helps if some layer injects default-src 'none')
app.use((req, res, next) => {
	const originalWriteHead = res.writeHead;
	res.writeHead = function(statusCode, reasonPhrase, headers) {
		try {
			// aplicamos una política relajada para desarrollo
			res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' http://localhost:3000 http://127.0.0.1:3000; connect-src 'self' http://localhost:3000 ws://localhost:3000");
		} catch (e) {
			// ignore
		}
		return originalWriteHead.apply(this, arguments);
	};
	next();
});

// Simple request logger for debugging
app.use((req, res, next) => {
	console.log(`[req] ${req.method} ${req.url}`);
	next();
});

// Sobre-escribir/relajar Content Security Policy para desarrollo local (evita default-src 'none')
app.use((req, res, next) => {
	// Permitir recursos desde self y localhost para las pruebas locales
	res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' http://localhost:3000 http://127.0.0.1:3000; connect-src 'self' http://localhost:3000 ws://localhost:3000");
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

// Rutas API
app.use(clientRoutes);
app.use((req, res, next) => {
  // Only serve the SPA index.html for non-API GET requests that accept HTML.
  if (req.method !== 'GET') return next();

  // Skip known API prefixes so API routes (e.g. /purchases) return JSON
  const apiPrefixes = ['/api', '/clients', '/client', '/purchase', '/purchases', '/seed', '/_debug'];
  for (const p of apiPrefixes) {
    if (req.path === p || req.path.startsWith(p + '/')) return next();
  }

  // If the client doesn't accept HTML, don't serve the index
  if (!req.accepts || !req.accepts('html')) return next();

  // Aplicar header CSP relajado para la UI (solo en desarrollo)
  try {
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' http://localhost:3000 http://127.0.0.1:3000; connect-src 'self' http://localhost:3000 ws://localhost:3000");
  } catch (e) {}

  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
// Conexión a MongoDB si está disponible en MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || null;
if (MONGODB_URI) {
	mongoose.connect(MONGODB_URI)
		.then(() => {
			console.log('MongoDB conectado');
			app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
		})
		.catch(err => {
			console.error('Error conectando a MongoDB:', err.message);
			// arrancar servidor aun sin Mongo
			app.listen(PORT, () => console.log(`Servidor corriendo (sin Mongo) en http://localhost:${PORT}`));
		});
} else {
	console.log('MONGODB_URI no proporcionado, usando DB en memoria');
	app.listen(PORT, () => console.log(`Servidor corriendo (sin Mongo) en http://localhost:${PORT}`));
}
