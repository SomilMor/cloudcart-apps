FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && ls -la node_modules && ls node_modules | head -20

COPY . .

RUN ls -la node_modules && ls node_modules | head -20

EXPOSE 3000

CMD ["node", "server.js"]