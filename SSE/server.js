const express = require("express");
const cors = require("cors");
const app = express();

let connections = [];

app.use(cors());
app.use(express.json());

app.get("/events", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");

	connections.push(res);

	req.on("close", () => {
		connections = connections.filter((conn) => conn !== res);
	});
});

setInterval(() => {
	const serverTime = new Date().toISOString();
	const connectionCount = connections.length;

	const data = JSON.stringify({
		serverTime,
		connectionCount,
	});

	connections.forEach((conn) => conn.write(`data: ${data}\n\n`));
}, 1000);

app.listen(3000, () =>
	console.log("SSE server running on http://localhost:3000")
);
