import logging


class LogManager:
    def __init__(self):
        logger = logging.getLogger("api")
        logger.setLevel(logging.DEBUG)
        fh = logging.FileHandler("QED.log")
        fh.setLevel(logging.ERROR)
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        fh.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fh.setFormatter(formatter)
        ch.setFormatter(formatter)
        logger.addHandler(fh)
        logger.addHandler(ch)
        self.logger = logger

    def log_error(self, message):
        self.logger.error(message)

    def log_debug(self, message):
        self.logger.debug(message)


if __name__ == '__main__':
    l = LogManager()
    l.log_error("this is an error")
