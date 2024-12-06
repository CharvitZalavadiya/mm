import { WebSocketServer } from 'ws';

let wss;

export function createWebSocketServer(server) {
  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/friends/chat')) {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  console.log('WebSocket server is set up for /friends/chat');
  return wss;
}

export function getWebSocketServer() {
  if (!wss) {
    throw new Error('WebSocket server is not initialized');
  }
  return wss;
}
