FROM node:18-alpine

WORKDIR /app/frontend

# Copy package.json and package-lock.json (if exists)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# # Install serve as a local dependency
# RUN npm install serve

# Copy application code
COPY . .

ARG VITE_SERVER_ORIGIN

ENV VITE_SERVER_ORIGIN=$VITE_SERVER_ORIGIN

# Run Vite build and verify output
RUN npm run build

CMD ["npm", "run" "dev"]
