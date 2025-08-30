// chat-app/server.js
const WebSocket = require('ws');

// It's good practice to get the port from environment variables,
// especially in Docker where ports might be assigned dynamically.
const port = process.env.PORT || 8080; 

const wss = new WebSocket.Server({ port: port });

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        try {
            // Parse the message to determine its type
            const data = JSON.parse(message);
            
            if (data.type === 'file') {
                // Validate file size
                const fileSize = Buffer.from(data.fileData, 'base64').length;
                if (fileSize > MAX_FILE_SIZE) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'File size exceeds maximum limit of 10MB'
                    }));
                    return;
                }

                console.log(`Received file: ${data.fileName} (${data.fileType})`);
                // Broadcast file to all clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'file',
                            fileData: data.fileData,
                            fileName: data.fileName,
                            fileType: data.fileType,
                            fileSize: fileSize,
                            sender: data.sender,
                            timestamp: data.timestamp
                        }));
                    }
                });
            } else if (data.type === 'audio') {
                console.log('Received audio message');
                // Broadcast audio message to all clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'audio',
                            audioData: data.audioData,
                            sender: data.sender,
                            timestamp: data.timestamp
                        }));
                    }
                });
            } else if (data.type === 'text') {
                console.log(`Received text message: ${data.content}`);
                // Broadcast text message to all clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'text',
                            content: data.content,
                            sender: data.sender,
                            timestamp: data.timestamp
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('Error processing message:', error);
            // Handle legacy text messages (for backward compatibility)
            console.log(`Received legacy message: ${message}`);
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.onerror = error => {
        console.error('WebSocket error:', error);
    };
});

console.log(`WebSocket server started on port ${port}`);