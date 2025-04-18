FROM node:18-alpine

WORKDIR /app/frontend

# Copy package.json and package-lock.json (if exists)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Install serve as a local dependency
RUN npm install serve

# Copy application code
COPY . .

# Run Vite build and verify output
RUN npm run build && ls -la dist

# Expose port 3000
EXPOSE 3000

# Serve the dist folder
# CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
CMD ["npm", "run" "dev"]
