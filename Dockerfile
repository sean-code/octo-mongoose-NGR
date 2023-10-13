# Use the official Node.js image as a base image
FROM node:16

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Expose port 3000 to the outside
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
