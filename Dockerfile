

#self
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /.

# Install dependencies for both frontend and backend
COPY package*.json ./
RUN npm install

# Set environment variables before building the frontend
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c2FjcmVkLWFudGVhdGVyLTc3LmNsZXJrLmFjY291bnRzLmRldiQ
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notes
ENV MONGODB_URI="mongodb+srv://cz:cz@cluster0.uvhgvjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
ENV NEXT_PUBLIC_SECRET_KEY_ENCRYPTION=c7ba868af8bf7c155cf9e0439a6926b1bcb5ca5adb4690ab682f38eb6992ff03

# Copy the frontend (Next.js) and backend (Express.js) code into the container
COPY . .

# Build the Next.js frontend
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /.

COPY --from=build /package*.json ./
COPY --from=build ./node_modules ./
COPY --from=build /public ./
COPY --from=build /.next ./

# Expose the necessary ports
EXPOSE 8080
EXPOSE 3000

# Start both frontend and backend using a process manager or script
CMD ["npx", "concurrently", "npm run dev:frontend", "npm run dev:backend"]





# # Use the Node.js image
# FROM node:20-alpine

# # Set the working directory to the root of the project (MM folder)
# WORKDIR /MM

# # Copy package.json and package-lock.json to install dependencies
# COPY package*.json ./

# # Install dependencies for both frontend and backend
# RUN npm install --force

# # Copy the entire project into the container
# COPY . .

# # Expose ports for both frontend (3000) and backend (8080)
# EXPOSE 3000 8080

# # Use `concurrently` to run both frontend (Next.js) and backend (Express.js) services
# CMD ["npx", "concurrently", "npm run dev:frontend", "npm run dev:backend"]



# ChatGPT
# Stage 1: Build the application
# FROM node:20-alpine AS build

# # Set the working directory in the container
# WORKDIR /.

# # Install dependencies for both frontend and backend
# COPY package*.json ./
# RUN npm install

# # Set environment variables before building the frontend
# ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c2FjcmVkLWFudGVhdGVyLTc3LmNsZXJrLmFjY291bnRzLmRldiQ
# ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
# ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
# ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes
# ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notes
# ENV MONGODB_URI="mongodb+srv://cz:cz@cluster0.uvhgvjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# ENV NEXT_PUBLIC_SECRET_KEY_ENCRYPTION=c7ba868af8bf7c155cf9e0439a6926b1bcb5ca5adb4690ab682f38eb6992ff03

# # Copy the frontend (Next.js) and backend (Express.js) code into the container
# COPY . .

# # Build the Next.js frontend
# WORKDIR /src/app
# RUN npm run build

# # Stage 2: Production image
# FROM node:20-alpine AS production

# # Set the working directory for the production image
# WORKDIR /.

# # Copy only necessary files from the build stage
# COPY --from=build /package*.json ./
# COPY --from=build /server ./
# COPY --from=build /public ./
# COPY --from=build ./node_modules ./

# # Ensure that the .next folder exists before copying
# COPY --from=build /.next /.next

# # Expose the necessary ports
# EXPOSE 8080
# EXPOSE 3000

# # Set environment variables for production (if needed)
# ENV NODE_ENV=production

# # Start both frontend and backend using a process manager or script
# CMD ["npx", "concurrently", "npm run dev:frontend", "npm run dev:backend"]