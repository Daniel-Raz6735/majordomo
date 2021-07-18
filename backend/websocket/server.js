const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const HttpsServer = require('https').createServer;
const HttpServer = require('http').createServer;
const fs = require('fs');
const express = require('express');
const http_port = 8888;
const ws_port = 8010;
const app = express();
app.use(express.static('public'));
app.get('/notify_client', (req, res) => {
    console.log(req.query);
    brodcastAll(JSON.stringify(req.query));
    res.send(req.query)
    // console.log("message recived");
    // var message = req.query.message
    // var cat = req.query.cat,
    // data = {"cat":cat,"message":message}
    // res.send(message)
    
});

// server = HttpServer({})
server = HttpsServer({
    cert: fs.readFileSync("/etc/letsencrypt/live/majordomo.cloudns.asia/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/majordomo.cloudns.asia/privkey.pem")
})
const https_serv = https.createServer(app);
https_serv.listen(http_port, function listening() {
    console.log('http listening on ' + http_port);

});

var WebSocketServer = WebSocket.Server, wss = new WebSocketServer({server:server});
wss.on('connection', function (ws) {
    ws.on('message', function (message) { brodcastAll(JSON.stringify("message",message)); })
});
console.log("Server started");
var Msg = '';
function brodcastAll(message) {
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
server.listen(ws_port);
console.log('ws listening on ' + ws_port);