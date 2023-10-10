const express = require('express');
const server = require('http').createServer();
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname})
});

server.on('request', app);

server.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
});

/** Begin websocket */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({server: server});

wss.on('connection', function connection(ws) {
	const numClients = wss.clients.size;
	console.log(`Clients connected: ${numClients}`);

	wss.broadcast(`Current visitors: ${numClients}`);

	if (ws.readyState === ws.OPEN) {
		ws.send('Welcone to my server');
	}

	ws.on('close', function close(){
		wss.broadcast(`Current visitors: ${wss.clients.size}`);
		console.log('A client has disconected');
	})
});

wss.broadcast = function brodcast(data) {
	wss.clients.forEach(function each(client){
		client.send(data);
	});
}