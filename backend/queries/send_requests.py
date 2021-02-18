import requests
import datetime
from pydantic import BaseModel
from typing import List


class Weighing(BaseModel):

    container_id: int
    weight: float
    date: datetime


    # def __init__(self, container_id, weight, date):
    #     self.container_id = container_id
    #     self.weight = weight
    #     self.date = date


class WeighingList(BaseModel):
    weighing: Weighing

    # def __init__(self, weighing):
    #     self.weighing = weighing

def add_weight(id, weight, date):
    """This function get id, list of weight and date for container"""


    time = datetime.datetime.now()

    w = Weighing(container_id = id, weight=weight, date=1)

    s = WeighingList(weighing=w)

    # url = 'https://majordomo.cloudns.asia/add/weight'
    url = 'http://127.0.0.1:8000/add/weight'
    data = dict(w)
    print(data)

    res = requests.post(url, json = data)

    print(res.text)


if __name__ == '__main__':

    add_weight(1, 20, datetime.datetime.now())
