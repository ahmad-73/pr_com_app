# chat-app/Dockerfile

# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists) to the working directory
# This step is done separately to leverage Docker's layer caching.
# If only package.json changes, it won't re-run npm install unnecessarily.
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on.
# This informs Docker that the container listens on the specified network ports at runtime.
# It does NOT publish the port. Publishing is done with -p when running.
EXPOSE 8080

# Define the command to run your application
CMD [ "npm", "start" ]