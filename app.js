var http = require('http');
var fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
        res.write("On the way to being a full stack engineer!")
        res.end();
});

server.listen(PORT);
console.log(`Server started on port ${PORT}`)
