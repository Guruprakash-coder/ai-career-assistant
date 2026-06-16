# Use official lightweight Node image
FROM node:22-slim

WORKDIR /app

# Copy package definitions
COPY package*.json ./

# Install package dependencies
RUN npm install

# Copy application sources
COPY . .

# Expose the Vite server port
EXPOSE 5173

# Start the Vite development server binding to host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host"]
