# Use the Node.js image
FROM node:20

# Set the working directory to the root of the project (MM folder)
WORKDIR /MM

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies for both frontend and backend
RUN npm install --force

# Copy the entire project into the container
COPY . .

# Expose ports for both frontend (3000) and backend (8080)
EXPOSE 3000 8080

# Use `concurrently` to run both frontend (Next.js) and backend (Express.js) services
CMD ["npx", "concurrently", "npm run dev:frontend", "npm run dev:backend"]
