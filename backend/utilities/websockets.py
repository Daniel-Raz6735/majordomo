from fastapi import WebSocket, WebSocketDisconnect, HTTPException

class WebSocketManager:
    def __init__(self):
        self.active_connections = {}

    async def connect_socket(self, websocket: WebSocket, business_id: int):
        await websocket.accept()
        if business_id not in self.active_connections:
            self.active_connections[business_id] = []
        self.active_connections[business_id].append(websocket)
        # await self.broadcast(str(business_id)+" joined the room ", business_id, websocket)

    def disconnect(self, websocket: WebSocket, business_id: int):
        self.active_connections[business_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, business_id: int, websocket: WebSocket = None):
        if business_id in self.active_connections:
            for connection in self.active_connections[business_id]:
                if websocket != connection:
                    await connection.send_text(message)
        else:
            print("no client connected")

    @staticmethod
    def get_socket_page():
        return html_sample


html_sample = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/wss");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""
