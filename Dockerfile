FROM node:20-alpine AS base
WORKDIR /app

# Instalar curl para verificaciones de salud
RUN apk add --no-cache curl

# Copiamos los manifiestos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos solo dependencias de producción cuando sea posible
RUN if [ -f package-lock.json ]; then \
		npm ci --only=production --no-audit --no-fund; \
	else \
		npm install --only=production --no-audit --no-fund; \
	fi

# Copiamos el resto del proyecto
COPY . .

# Variable de entorno para producción
ENV NODE_ENV=production
ENV PORT=443

# Puerto que expone la app
EXPOSE 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:443/_debug || exit 1

# Comando por defecto
CMD ["node", "index.js"]