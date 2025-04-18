# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app/server

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

RUN npm run build
RUN ls -l

COPY . .

# Development stage
FROM builder AS development
# Set NODE_ENV to development
ENV NODE_ENV=development

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application(in development)
CMD ["npm", "run", "dev"]

# Production stage
# FROM builder AS production
# # Set NODE_ENV to production
# ENV NODE_ENV=production

# # Run any production-specific build steps if needed here

# # Run the production command
# CMD ["npm", "start"]








# Important cmds
# a)build image in development
# sudo docker build -t reactdockerdemo:development --target development .

# b)Build image in production
# sudo docker build -t reactdockerdemo:development --target development .


