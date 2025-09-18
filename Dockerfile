

#self
FROM node:current-alpine3.22 AS build

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

FROM node:current-alpine3.22 AS runner

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