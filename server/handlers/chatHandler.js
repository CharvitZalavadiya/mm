import Message from '../../src/models/Message.js';
import { getWebSocketServer } from '../webSocketServer.js';

const clients = new Map();

export function setupChatHandler() {

    const wss = getWebSocketServer();

    wss.on('connection', (ws, req) => {
        const userId = loggedinUser.userId;
        if (userId) clients.set(userId, ws);

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                const { to, content } = data;

                const newMessage = await Message.create({
                    from: loggedinUser,
                    to: selectedUser,
                    content,
                    timestamp: new Date(),
                });

                if (clients.has(to)) {
                    const recipientSocket = clients.get(to);
                    recipientSocket.send(JSON.stringify({ from: userId, content }));
                } else {
                    ws.send(JSON.stringify({ error: 'Recipient is not connected' }));
                }
            } catch (err) {
                console.error('Error processing message:', err);
            }
        });

        ws.on('close', () => {
            if (userId) clients.delete(userId);
        });
    });

    console.log('Chat handler is set up');
}
