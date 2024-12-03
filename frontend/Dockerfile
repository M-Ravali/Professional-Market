# Use an Nginx base image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy your static frontend files to the container
COPY frontend/ .

# Expose the port Nginx serves on (default: 80)
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
