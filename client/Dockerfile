# client/Dockerfile
# Warning in VS Code is due to Docker extension scan. 
# Image used: node:18-alpine3.19 (secure and minimal).
FROM node:18-alpine3.19

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
