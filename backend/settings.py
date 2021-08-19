from utilities.logManager import LogManager
from utilities.websockets import WebSocketManager
from utilities.configManager import ConfigManager
from utilities.connection_manager import Connection
from utilities.email_client import EmailManager


class Settings:
    def __init__(self):
        self.web_socket_manager = WebSocketManager()
        self.email_client = EmailManager()
        self.log_manager = LogManager()
        self.config_manager = ConfigManager()
        self.connection_manager = Connection(active=False)
        self.notifications_handler = None

    def add_notification_handler(self, notifications_handler):
        self.notifications_handler = notifications_handler

