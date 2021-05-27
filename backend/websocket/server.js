const WebSocket = require('ws');
const http = require('http');
const HttpsServer = require('https').createServer;
const fs = require('fs');
const express = require('express');
const port = 8888;
const app = express();
app.use(express.static('public'));
app.get('/ws_test', (req, res) => {
    console.log("message recived");
    console.log(req.query.message);
    brodcastAll(req.query.message);
});

server = HttpsServer({
    cert: fs.readFileSync("/etc/letsencrypt/live/majordomo.cloudns.asia/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/majordomo.cloudns.asia/privkey.pem")
})
const https = http.createServer(app);
https.listen(port, function listening() {
    console.log('listening on ' + port);
});

var WebSocketServer = WebSocket.Server
    , wss = new WebSocketServer({server:server});
wss.on('connection', function (ws) {
    ws.on('message', function (message) { brodcastAll(message); })
});
console.log("Server started");
var Msg = '';
function brodcastAll(message) {
    console.log('Received from client: %s', message);

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
            console.log("sent")
        }
        else {
            console.log("not sent")

        }
    });
}
server.listen(8010);