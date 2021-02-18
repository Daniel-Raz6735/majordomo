import requests
import datetime
from pydantic import BaseModel
from typing import List


class Weighing(BaseModel):

    container_id: int
    weight: float
    date: int


class WeighingList(BaseModel):
    weights: List[Weighing]


def add_weight(id, weight, date):
    """This function get id, list of weight and date for container"""
    sec = datetime.timedelta(seconds=24 * 60 * 60).total_seconds()

    w = Weighing(container_id=id, weight=weight, date=int(sec))

    data = WeighingList(weights=[w])

    # url = 'https://majordomo.cloudns.asia/add/weight'
    url = 'http://127.0.0.1:8000/add/weight'

    res = requests.post(url, json = data.dict())

    print(res.text)

if __name__ == '__main__':

    add_weight(1, 20, 0)
