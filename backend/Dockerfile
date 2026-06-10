FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY backend ./backend

EXPOSE 3001

CMD ["node", "backend/server.ts"]
