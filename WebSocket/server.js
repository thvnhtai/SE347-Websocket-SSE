const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });

const clients = new Set();

server.on("connection", (ws) => {
	clients.add(ws);

	ws.on("close", () => {
		clients.delete(ws);
	});
});

setInterval(() => {
	const serverTime = new Date().toISOString();
	const connectionCount = clients.size;

	const data = JSON.stringify({
		serverTime,
		connectionCount,
	});

	clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
}, 1000);

console.log("WebSocket server running on ws://localhost:3000");
