const WebSocket = require('ws');
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const port = 8888;
const app = express();
app.use( express.static('public') );
app.get('/ws_test', (req, res) => {
    console.log("message recived");
        console.log(req.params);
        brodcastAll(req.params["message"]);
    res.json({ok: true});
});

const httpsServer = http.createServer(app);
//     ,{
    //     cert: fs.readFileSync('/etc/letsencrypt/live/majordomo.cloudns.asia/fullchain.pem;'),
    //     key: fs.readFileSync('/etc/letsencrypt/live/majordomo.cloudns.asia/privkey.pem;')
    //   }

httpsServer.listen( port, function listening(){
    console.log( 'listening on ' + port );
});

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
            //console.log(client)
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
            console.log("sent")
        }
        else {
            console.log("not sent")

        }
    });
}
