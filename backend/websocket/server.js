

const port = 8888;
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
app.use( express.static('public') );
app.get('/curl', (req, res) => {brodcastAll(req.params["message"])});

const httpsServer = https.createServer(app);
//     ,{
    //     cert: fs.readFileSync('/etc/letsencrypt/live/majordomo.cloudns.asia/fullchain.pem;'),
    //     key: fs.readFileSync('/etc/letsencrypt/live/majordomo.cloudns.asia/privkey.pem;')
    //   }
    
httpsServer.listen( port, function listening(){
    console.log( 'listening on ' + port );
});

const WebSocket = require('ws');
var WebSocketServer = WebSocket.Server
, wss = new WebSocketServer({ port: 8010 });
wss.on('connection', function (ws) {
    ws.on('message', function (message) { brodcastAll(message); })
});
console.log("Server started");
var Msg = '';
function brodcastAll(message) {
    console.log('Received from client: %s', message);
   
    wss.clients.forEach(function each(client) {
        console.log(client)
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
            console.log("sent")
        }
        else {
            console.log("not sent")

        }
    });
}