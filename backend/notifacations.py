import schedule
import psycopg2

from email_client import EmailManager
from queries.read_queries import ReadQueries as readQ
from queries.connection_manager import Connection


class NotificationsHandler:
    def __init__(self):
        self.active_businesses = []
        self.content_minimum_time: int = 4
        self.content_maximum_time: int = 4
        self.email_client = EmailManager()
        self.alert_dict = self.create_alert_dictionary()

    def __del__(self):
        schedule.clear()

    def play_schedules(self, businesses):
        for business_id in businesses:
            self.active_businesses.append(business_id)
            schedule.every(3).seconds.do(routine_check, business_id=business_id)

    def create_alert_dictionary(self):
        """this function creates an alert dictionary that will look like this
            {business id:{
                        item_id:{
                            "total_maximum":value,
                            "total_minimum":value,
                            "maximum_per_day":value,
                            "minimum_per_day":value,
                            "unit":value,
                            "sum":value,
                            containers:{
                                container id :{weight:value, unit:value}

                             }
                             }"""
        alert_dict = {}
        try:
            connection = Connection()
            reader = readQ(connection)
            rules_query = reader.get_rules_query()
            rules = connection.get_result(rules_query)
            if rules:

                for rule in rules:
                    item_info = {}
                    if "item_id" in rule and rule["item_id"] and "business_id" in rule and rule["business_id"]:
                        business_id = rule["business_id"]
                        item_id = rule["item_id"]
                        if "content_minimum_per_day" in rule and rule["content_minimum_per_day"]:
                            item_info["minimum_per_day"] = rule["content_minimum_per_day"]
                        if "content_maximum_per_day" in rule and rule["content_maximum_per_day"]:
                            item_info["maximum_per_day"] = rule["content_maximum_per_day"]
                        if "content_total_minimum" in rule and rule["content_total_minimum"]:
                            item_info["total_minimum"] = rule["content_total_minimum"]
                        if "content_total_maximum" in rule and rule["content_total_maximum"]:
                            item_info["total_maximum"] = rule["content_total_maximum"]
                        if "item_average_weight" in rule and rule["item_average_weight"]:
                            item_info["item_average_weight"] = rule["item_average_weight"]
                        item_info["sum"] = 0
                        if business_id not in alert_dict:
                            alert_dict[business_id] = {}
                        alert_dict[business_id][item_id] = item_info
            current_weight_by_container = reader.get_current_weight(get_by_container=True)
            containers = connection.get_result(current_weight_by_container)
            if containers:
                for container in containers:
                    try:
                        business_id = container["business_id"]
                        item_id = container["item_id"]
                        container_id = container["container_id"]
                        container_data = {"weight": container["weight"], "unit": container["unit"]}
                        item_info = alert_dict[business_id][item_id]
                        if "containers" not in item_info:
                            item_info["containers"] = {}
                        item_info["containers"][container_id] = container_data
                    except KeyError:
                        pass
            notification_list_query = reader.get_notifications()
            notifications = connection.get_result(notification_list_query)
            if notifications:
                for notification in notifications:
                    try:
                        business_id = notification["business_id"]
                        item_id = notification["item_id"]
                        code = notification["code"]
                        item_info = alert_dict[business_id][item_id]
                        item_info["active_notification"] = code
                    except KeyError:
                        pass

        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
            self.email_client.email_admin("Error reading notification data", "error details:"+str(error))
        del connection
        return alert_dict

    def test_minimum(self, business_id, item_id):
        pass

    def test_maximum(self, business_id, item_id):
        pass

    def test_new_weight(self, business_id, item_id):
        pass

    @staticmethod
    def run_tasks():
        schedule.run_pending()


def routine_check(business_id):
    print("routine_check:", business_id)
