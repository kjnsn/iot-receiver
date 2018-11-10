const express = require('express');
const net = require('net');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const { parseInput, processInput } = require('./input');

let DataState = undefined;

function sendState() {
    io.emit('new state', DataState);
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', (socket) => {
    sendState();
    console.log("got socket")
})

http.listen(3000, () => {
    console.log("listening on *:3000");
});

// Create the TCP server.
const srv = net.createServer((c) => {
    c.on('data', (data) => {
        const parsed = parseInput(data.toString('utf-8'));
        DataState = processInput(DataState, parsed);
        sendState();
    });
});

srv.listen(3001, () => {
    console.log("TCP listening on *:3001");
});
