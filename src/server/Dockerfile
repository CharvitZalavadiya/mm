# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /usr/src/server

# Copy package.json and package-lock.json
COPY src/server/package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of your application code
COPY src/server .

# Expose the port your Express app runs on
EXPOSE 8080

# Start Express.js app
CMD ["node", "--watch", "app"]
