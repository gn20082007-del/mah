FROM node:1.0.0
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p uploads
EXPOSE 5000
CMD ["node", "server.js"]
