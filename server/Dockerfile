# server/Dockerfile
# Warning in VS Code is due to Docker extension scan. 
# Image used: node:18-alpine3.19 (secure and minimal).
FROM node:18-alpine3.19

WORKDIR /app

# ✅ Use apk to install python3 and g++
RUN apk add --no-cache python3 g++

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
