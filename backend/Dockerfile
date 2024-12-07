# Use Node.js 16 LTS as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose port 5000
EXPOSE 5000

# Command to run your application
CMD ["npm", "start"]