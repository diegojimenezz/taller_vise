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