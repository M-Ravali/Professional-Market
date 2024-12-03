# Use an appropriate base image (Node.js is used in this example)
FROM node:18   

# Replace with your backend's runtime image

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json ./   

# Install backend dependencies
RUN npm install

# Copy the backend source code
COPY backend/ .

# Expose the backend port (usually 5000 for Node.js)
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]   # Modify this if using a different backend server command
