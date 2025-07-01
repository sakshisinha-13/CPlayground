# compiler/Dockerfile
FROM node:18-alpine

# ✅ Install g++ and python3
RUN apk add --no-cache g++ python3

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000
CMD ["npm", "start"]
