import requests
from pydantic import BaseModel
from typing import List
import time


# object that represent weight for container.
class Weighing(BaseModel):
    container_id: int
    weight: float
    date: int = int(time.time())


# object that represent list of weights
class WeighingList(BaseModel):
    weights: List[Weighing]


def add_weight(container_id, weight):
    """This function get container id, weight and send post request to the backend"""

    w = Weighing(container_id=container_id, weight=weight)

    data = WeighingList(weights=[w])

    # url = 'https://majordomo.cloudns.asia/add/weight'
    url = 'http://127.0.0.1:8000/add/weight'+'?client_time='+int(time.time())

    requests.post(url, json = data.dict())


if __name__ == '__main__':
    add_weight(1, 20)
