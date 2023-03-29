# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app for production
RUN npm run build --prod pmage_front

# Use NGINX as the web server
FROM nginx:alpine

# Copy the built app from the previous stage to the NGINX HTML directory
COPY --from=0 /app/dist/pmage_front /usr/share/nginx/html