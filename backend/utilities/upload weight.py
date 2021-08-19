import requests
from pydantic import BaseModel
from typing import List
import time


# object that represent weight for container.
class Weighing(BaseModel):
    container_id: int
    weight_value: float
    weighing_date: int


# object that represent list of weights
class WeighingList(BaseModel):
    weights: List[Weighing]


def add_weight(container_id, weight):
    """This function gets a container id and weight and sends a post request to the backend
    using the Weighing and WeighingList classes"""
    w = Weighing(container_id=container_id, weight_value=weight, weighing_date=int(time.time()))
    data = WeighingList(weights=[w])
    url = 'https://majordomo.cloudns.asia/add/weight'
    # url = 'http://127.0.0.1:8000/add/weight'
    url += '?client_time=' + str(int(time.time()))
    res = requests.post(url, json=data.dict())
    if res.text is None:
        print("weight uploaded successfully")
    else:
        print(res.text)


if __name__ == '__main__':
    try:
        while True:
            try:
                container = input("enter container id: ")
                while True:
                    weight_str = input("Enter wight or q to quit: ")
                    add_weight(container, float(weight_str))
            except Exception:
                pass
    except Exception:
        pass
