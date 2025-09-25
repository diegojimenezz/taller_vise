FROM node:20-alpine AS base
WORKDIR /app

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

# Puerto que expone la app
EXPOSE 3000

# Comando por defecto
CMD ["node", "index.js"]