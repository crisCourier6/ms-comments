# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory
WORKDIR /ms-comments

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 2001

# Command to run your app
CMD ["npm", "start"]
