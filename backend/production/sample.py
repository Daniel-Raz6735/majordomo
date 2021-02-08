from fastapi import FastAPI
import uvicorn

# initialize API
app = FastAPI()

@app.get('/')
def get_func():
    return {'text': 'hello world'}, 200


if __name__ == '__main__':
    app.run()
