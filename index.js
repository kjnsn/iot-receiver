const express = require('express');
const net = require('net');
const app = express();
const log = require('loglevel');
const http = require('http').Server(app);
const io = require('socket.io')(http);

log.setLevel(process.env.LOG || 'info');

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
    log.debug("got socket")
})

http.listen(3000, () => {
    log.info("listening on *:3000");
});

// Create the TCP server.
const srv = net.createServer((c) => {
    log.debug("connection recieved from", c.remoteAddress + ":" + c.remotePort);
    let buf = "";
    c.on('data', (data) => {
        log.debug("received", data.length, "bytes from", c.remoteAddress + ":" + c.remotePort);
        buf += data.toString('utf-8');
        if (buf.includes("\n")) {
            const msgs = buf.split("\n");
            // Only process all but the last, as the last may not be completely received yet.
            msgs.slice(0, msgs.length - 1).forEach(msg => {
                // Ignore empty messages.
                if (msg.length === 0) {
                    return;
                }
                // Cut the current message out of the buffer.
                buf = buf.slice(msg.length);
                const parsed = parseInput(msg);
                DataState = processInput(DataState, parsed);
            });
            sendState();
        }
        
    });
});

srv.listen(3001, () => {
    log.info("TCP listening on *:3001");
});
