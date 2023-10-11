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

/** begin websocket */
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({server: server});

process.on('SIGINT', async () => {
	console.log();
	wss.close(() => {
		console.log('wss closed');
		server.closeAllConnections();
		server.close((e) => {
			console.log('http server closed')
			if(e) console.log(e);
			shutdownDB();
		});
	});
	for(const ws of wss.clients){
		ws.close();
	}
});

// Save created sockets for destriying when server ends
// const sockets = [];
// server.on('connection', (socket) => {
// 	sockets.push(socket);
// })

wss.on('connection', function connection(ws) {
	const numClients = wss.clients.size;
	console.log(`Clients connected: ${numClients}`);

	wss.broadcast(`Current visitors: ${numClients}`);

	if (ws.readyState === ws.OPEN) {
		ws.send('Welcone to my server');
	}

	db.run(`
		INSERT INTO visitors (count, time)
		VALUES (${numClients}, datetime('now'))`
	);

	ws.on('close', function close(){
		wss.broadcast(`Current visitors: ${wss.clients.size}`);
		console.log('A client has disconected');
	});
});

wss.broadcast = function brodcast(data) {
	wss.clients.forEach(function each(client){
		client.send(data);
	});
}

/* end websocket  */

/* begin database */

const sqlite = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
	db.run(`
		CREATE TABLE visitors (
			count INTEGER,
			time TEXT
		)
	`)
})

function getCounts() {
	db.each("SELECT * FROM visitors", (err, row) => {
		console.log(row);
	})
}

function shutdownDB() {
	console.log("shutting down db");
	getCounts();
	db.close()
}

/* end database */