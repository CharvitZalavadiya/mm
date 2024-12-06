// import { WebSocketServer, WebSocket } from 'ws';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { IncomingMessage } from 'http';

// let wss: WebSocketServer | undefined;
// const clients = new Map<string, WebSocket>();

// export const GET = async (req: Request): Promise<Response> => {
//   if (!wss) {
//     wss = new WebSocketServer({ noServer: true });

//     wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
//       const userId = new URL(request.url || '', `http://${request.headers.host}`).searchParams.get('userId');
//       if (userId) clients.set(userId, ws);

//       ws.on('message', (message: string) => {
//         const data = JSON.parse(message) as { to: string; content: string };
//         const { to, content } = data;

//         if (clients.has(to)) {
//           const recipientSocket = clients.get(to)!;
//           recipientSocket.send(JSON.stringify({ from: userId, content }));
//         } else {
//           ws.send(JSON.stringify({ error: 'User not connected' }));
//         }
//       });

//       ws.on('close', () => {
//         if (userId) clients.delete(userId);
//       });

//       ws.send(JSON.stringify({ message: 'Connected to WebSocket server' }));
//     });
//   }

//   return new Response(JSON.stringify({ message: 'WebSocket server is running' }));
// };

// // Edge runtime configuration for API routes
// export const config = {
//   runtime: 'edge',
// };
