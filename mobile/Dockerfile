# Dockerfile
FROM node:18

RUN npm install -g expo-cli

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY babel.config.js ./
COPY app.json ./
COPY .env ./
COPY . .

EXPOSE 19000 19001 19002

CMD ["expo", "start", "--tunnel"]
