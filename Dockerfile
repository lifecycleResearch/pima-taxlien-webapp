FROM node:20-alpine

WORKDIR /app

# Install Hermes Agent globally
RUN npm install -g hermes-agent

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build client
RUN cd client && npm install && npm run build

EXPOSE 3000 8642

# Start script
CMD hermes gateway & node server.js
