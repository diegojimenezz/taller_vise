# VISE - Sistema de Gestión de Clientes y Compras

Sistema de gestión de clientes y procesamiento de compras con validación de tarjetas y aplicación de descuentos según el tipo de tarjeta del cliente.

## 📋 Descripción del Proyecto

VISE es una aplicación web que permite:
- Registrar y gestionar clientes con diferentes tipos de tarjetas (Classic, Gold, Platinum, Black, White)
- Procesar compras validando las restricciones de cada tipo de tarjeta
- Aplicar descuentos y beneficios según el tipo de tarjeta
- Visualizar el historial de compras de los clientes

## 🏗️ Arquitectura y Estructura del Proyecto

```
taller_vise/
├── public/                 # Frontend estático
│   ├── index.html          # Página principal
│   ├── app.js             # Lógica del frontend
│   └── styles.css         # Estilos CSS
├── src/                   # Backend - Código fuente
│   ├── Controller/         # Controladores HTTP
│   ├── Models/            # Modelos de datos (Mongoose)
│   ├── Routers/           # Definición de rutas
│   ├── Services/          # Lógica de negocio
│   ├── Data/              # Configuración de base de datos
│   └── utils/             # Funciones auxiliares
├── scripts/               # Scripts de inicialización
├── .env                   # Variables de entorno
├── .gitignore             # Archivos ignorados por Git
├── Dockerfile             # Configuración de Docker
├── docker-compose.yml     # Configuración de servicios Docker
├── package.json           # Dependencias y scripts del proyecto
└── index.js              # Punto de entrada de la aplicación
```

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js con Express.js
- **Base de Datos**: MongoDB (con Mongoose ODM)
- **Frontend**: HTML, CSS, JavaScript vanilla
- **Contenedores**: Docker y Docker Compose
- **Monitoreo**: OpenTelemetry integrado con Axiom.co
- **Desarrollo**: Nodemon para recarga automática

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js v14 o superior
- npm o yarn
- Docker y Docker Compose (opcional)
- Cuenta en Axiom.co para monitoreo (opcional)

### Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd taller_vise
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (crear archivo `.env`):
```env
AXIOM_API_TOKEN=tu_token_aqui
AXIOM_DATASET_NAME=nombre_del_dataset
AXIOM_DOMAIN=api.axiom.co
```

### Ejecución

**Modo Desarrollo:**
```bash
npm run dev
```

**Modo Producción:**
```bash
npm start
```

**Con Docker:**
```bash
docker-compose up
```

## 📡 API Endpoints

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

### GET /clients

**Descripción:**
Obtiene la lista de todos los clientes registrados.

### GET /client/:id

**Descripción:**
Obtiene la información de un cliente específico por su ID.

### POST /client

**Descripción:**
Registra un nuevo cliente en el sistema.

### GET /purchases

**Descripción:**
Obtiene el historial de todas las compras realizadas.

### GET /purchases/client/:clientId

**Descripción:**
Obtiene el historial de compras de un cliente específico.

### GET /seed

**Descripción:**
Inicializa la base de datos con datos de prueba.

## 📊 Monitoreo con Axiom.co

El proyecto incluye integración con OpenTelemetry para enviar métricas y trazas a Axiom.co:

1. Configura las variables de entorno en `.env`
2. Las trazas se envían automáticamente a tu dataset en Axiom
3. Puedes visualizar el rendimiento, tiempos de respuesta y errores en la plataforma

## 🤝 Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Publica la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Jhoan Sebastian Cardenas** - *Desarrollo inicial* - [jhoan-sebastian-cardenas](https://github.com/jhoan-sebastian-cardenas)
- **Diego Jimenez** - *Desarrollo inicial* - [diegojimenezz](https://github.com/diegojimenezz)
