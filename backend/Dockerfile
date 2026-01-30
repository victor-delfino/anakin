FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm install

# Copiar código fonte
COPY . .

# Build TypeScript
RUN npm run build

# Expor porta
EXPOSE 3001

# Script que roda migrations, seeds e inicia o app
CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]
