# Use a base image with a lightweight web server
FROM nginx:alpine

# Copy all static files to the web server directory
COPY . /usr/share/nginx/html

# Expose port 3000 (though nginx defaults to port 80)
EXPOSE 3000

# Nginx is configured to run automatically in the nginx:alpine image