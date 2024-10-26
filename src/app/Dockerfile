# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY /package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of your application code
COPY src/app .

# Expose the port your Next.js app runs on
EXPOSE 3000

# Start Next.js app
CMD ["npm", "run", "dev"]
