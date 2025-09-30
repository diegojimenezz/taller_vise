# Plataforma de Compras VISE

## Descripción
Esta plataforma permite gestionar clientes y procesar compras con beneficios exclusivos según el tipo de tarjeta. Incluye validaciones de restricciones y cálculo de descuentos.

---

## Requisitos
- Node.js (v16 o superior)
- Docker (opcional para despliegue)

---

## Instalación y Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/diegojimenezz/taller_vise.git
   cd taller_vise
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno (si aplica).

---

## Modo Desarrollo

1. Inicia el servidor en modo desarrollo:
   ```bash
   npm start
   ```

2. Accede a la aplicación en tu navegador:
   ```
   http://localhost:3000
   ```

---

## Despliegue con Docker

1. Construye la imagen de Docker:
   ```bash
   docker build -t vise-platform .
   ```

2. Ejecuta el contenedor:
   ```bash
   docker run -p 3000:3000 vise-platform
   ```

3. Accede a la aplicación en tu navegador:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

### POST /purchase

**Descripción:**
Procesa una compra para un cliente, validando las restricciones de su tarjeta y aplicando los beneficios correspondientes.

**Body:**
```json
{
  "clientId": "<ID del cliente>",
  "amount": <Monto de la compra>,
  "date": "<Fecha de la compra en formato ISO>",
  "country": "<País donde se realiza la compra>"
}
```

**Responses:**
- **201 Created:**
  ```json
  {
    "status": "Success",
    "data": {
      "purchaseId": "<ID de la compra>",
      "clientId": "<ID del cliente>",
      "amount": <Monto original>,
      "discount": <Monto del descuento>,
      "finalAmount": <Monto final>,
      "date": "<Fecha de la compra>",
      "country": "<País de la compra>"
    }
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "status": "Rejected",
    "error": "<Motivo del rechazo>"
  }
  ```
- **404 Not Found:**
  ```json
  {
    "status": "Not Found",
    "error": "Cliente no encontrado"
  }
  ```
- **500 Internal Server Error:**
  ```json
  {
    "status": "Error",
    "error": "Error al guardar la compra"
  }
  ```