# Mind Maps

**Mind Maps** is a user-friendly web application designed to help you capture, edit, and organize your notes efficiently. With a focus on simplicity and color-coded organization, it enhances your note-taking experience.

## Features

- **Capture Notes**: Quickly jot down your thoughts and ideas.
- **Edit Notes**: Modify existing notes with ease.
- **Organize with Colors**: Assign colors to notes for better categorization.
- **User Authentication**: Securely access your notes with a personal account.
- **Friend Request**: User can send friend request to there friends on the same platform.
- **Chat**: One becoming the friend then go to friends tab at url /friends and click on card of your friends to have a real time chat.

## Getting Started

1. **Visit the Website**: Navigate to [Mind Maps](https://mind-maps.vercel.app/).
2. **Sign In**: Log into your existing account or create a new one.
3. **Create a Note**: Use the intuitive interface to start capturing your ideas.
4. **Organize**: Assign colors and edit notes as needed.
5. **Friends**: Go to Friends option where you will find many other users.
6. **Friend Request**: You can send friend request to any user and the status of it will be shown to you in the same page by navingating in Requests tab below the topbar .
7. **Chat**: Once you became friends then select the connected option from dropdown and select your friends to start the chatting.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Vercel**: Deployment platform for hosting the application.
- **Clerk**: User authentication and management.
- **Axios**: Promise-based HTTP client for API requests.
- **Socket.io**: Real-time chatting enviornment for two users.

## Development Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/mind-maps.git
   cd mind-maps
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Frontend**:

   ```bash
   npm run dev:frontend
   ```

   Open [http://localhost:3000](http://localhost:3000) to view frontend in the browser.

4. **Run the Backend**:

   ```bash
   npm run dev:backend
   ```

   Open [http://localhost:8080](http://localhost:8080) to view backend in the browser.

## Deployment

The application is deployed on Vercel. For deploying your own version:

1. **Create a Vercel Account**: Sign up at [Vercel](https://vercel.com/).
2. **Connect Repository**: Link your GitHub repository to Vercel.
3. **Configure Environment Variables**: Set up necessary environment variables in the Vercel dashboard.
4. **Deploy**: Initiate the deployment process through the Vercel interface.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Clerk](https://clerk.dev/) for authentication services.
- [Vercel](https://vercel.com/) for deployment infrastructure.
- [Next.js](https://nextjs.org/) for the React framework.
- [Clerk Auth](https://clerk.com/) for Authentication.
- [Socket.io](https://socket.io/) for Real-time chat enviornment.

For more information, visit the live application at [https://mind-maps.vercel.app/](https://mind-maps.vercel.app/). 