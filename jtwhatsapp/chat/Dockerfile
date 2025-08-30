# chat-app/client/Dockerfile

# Use a lightweight Nginx image
FROM nginx:alpine

# Copy your static files into the Nginx default public directory
# /usr/share/nginx/html is the default location for Nginx static files in this image
COPY . /usr/share/nginx/html

# Expose port 80, the default HTTP port for Nginx
EXPOSE 80

# Nginx starts automatically when the container runs due to the base image's CMD