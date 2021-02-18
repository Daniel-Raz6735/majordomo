import requests
import datetime


def add_weight(id, weight, date):
    """This function get id, list of weight and date for container"""

    time = datetime.datetime.now()

    url = 'https://majordomo.cloudns.asia/add/weight'
    data = {date:
            {'id': id,
             'weight': weight}
            }


    res = requests.post(url, data= data)

    print(res.text)


if __name__ == '__main__':
    add_weight(1, 20, "")