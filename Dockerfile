FROM node:18-alpine

WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm ci --only=production

# Copy app
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
