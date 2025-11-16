require("dotenv").config();

const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const { Resource } = require("@opentelemetry/resources");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");

// ===============================
//  VARIABLES DE ENTORNO
// ===============================
const AXIOM_API_TOKEN = process.env.AXIOM_API_TOKEN;
const AXIOM_DATASET_NAME = process.env.AXIOM_DATASET_NAME;
const AXIOM_DOMAIN = process.env.AXIOM_DOMAIN || "api.axiom.co";

console.log("🔍 Variables de entorno cargadas:");
console.log("  AXIOM_API_TOKEN:", AXIOM_API_TOKEN ? "✓ Configurado" : "✗ No configurado");
console.log("  AXIOM_DATASET_NAME:", AXIOM_DATASET_NAME || "✗ No configurado");
console.log("  AXIOM_DOMAIN:", AXIOM_DOMAIN);

// Si faltan credenciales, NO iniciamos OTEL pero tampoco rompes la app
if (!AXIOM_API_TOKEN || !AXIOM_DATASET_NAME) {
  console.log("⚠️ OpenTelemetry NO iniciado — faltan variables de entorno necesarias");
  module.exports = null;
  return;
}

console.log("🔧 Configurando OpenTelemetry…");

// ===============================
//  EXPORTADOR A AXIOM
// ===============================
const traceExporter = new OTLPTraceExporter({
  url: `https://${AXIOM_DOMAIN}/v1/traces`,
  headers: {
    Authorization: `Bearer ${AXIOM_API_TOKEN}`,
    "X-Axiom-Dataset": AXIOM_DATASET_NAME,
  },
  // Añadir más logging para depuración
  concurrencyLimit: 10,
});

console.log("📡 Configurado exportador OTLP a:", `https://${AXIOM_DOMAIN}/v1/traces`);
console.log("📦 Dataset:", AXIOM_DATASET_NAME);

// ===============================
//  IDENTIDAD DEL SERVICIO
// ===============================
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "vise-client-service",
});

// ===============================
//  CREAR SDK
// ===============================
let sdk;

try {
  sdk = new NodeSDK({
    resource,
    spanProcessor: new BatchSpanProcessor(traceExporter, {
      scheduledDelayMillis: 5000,
      exportTimeoutMillis: 30000,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-http": { enabled: true },
        "@opentelemetry/instrumentation-express": { enabled: true },
      }),
    ],
  });
  
  // INICIAR SDK
  console.log("🚀 Iniciando OpenTelemetry SDK...");
  sdk.start();
  console.log("✅ OpenTelemetry iniciado correctamente");
} catch (err) {
  console.error("❌ Error creando/iniciando NodeSDK:", err);
  module.exports = null;
  return;
}

// APAGADO ORDENADO
const shutdown = () => {
  console.log("🛑 Apagando OpenTelemetry SDK...");
  if (sdk) {
    sdk.shutdown()
      .then(() => console.log("✅ OpenTelemetry SDK apagado correctamente"))
      .catch((error) => console.log("❌ Error apagando OpenTelemetry SDK", error))
      .finally(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

module.exports = sdk;