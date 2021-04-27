import schedule
import psycopg2

from email_client import EmailManager
from queries.read_queries import ReadQueries as readQ
from queries.update_queries import UpdateQueries as updateQ
from queries.connection_manager import Connection

ITEM_CRITICAL = 1
ITEM_LOW = 2
ITEM_OVER = 3
KG = 1
LB = 2
UN = 3


class NotificationsHandler:
    def __init__(self):
        self.active_businesses = []
        self.content_minimum_time: int = 4
        self.content_maximum_time: int = 4
        self.email_client = EmailManager()
        self.alert_dict = self.create_alert_dictionary()
        self.dict_unit = 1

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
        connection = Connection()
        try:
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
            current_weight_by_container = reader.get_current_weight_query(get_by_container=True)
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
            self.email_client.email_admin("Error reading notification data", "error details:" + str(error))
        if connection:
            del connection
        return alert_dict

    def test_minimum(self, business_id, item_id):
        pass

    def test_maximum(self, business_id, item_id):
        pass

    def get_item(self, business_id, item_id):
        """tests if an item is in the alert dict and returns its information. returns None if not"""
        if self.alert_dict and business_id in self.alert_dict and item_id in self.alert_dict[business_id]:
            return self.alert_dict[business_id][item_id]
        return None

    def update_item(self, business_id, item_id, container_id, weight, unit, updater):
        try:
            if self.alert_dict:
                self.alert_dict[business_id][item_id]["containers"][container_id] = {'weight': weight, 'unit': unit}
                self.test_item(business_id, item_id, updater)
            else:
                raise KeyError
        except KeyError:
            self.create_alert_dictionary()

    def test_item(self, business_id, item_id, updater):
        """test an item in the alert dict and see if it needs a notification"""
        item_info = self.get_item(business_id, item_id)
        if item_info:
            active_notification = -1
            new_notification_level = -1
            if "active_notification" in item_info:
                active_notification = item_info["active_notification"]
            if "containers" in item_info:
                containers = item_info["containers"]
                sum = 0
                for key in containers:
                    container = containers[key]
                    if "unit" in container and "weight" in container:
                        if container["unit"] == UN:  # if item is weighed in units
                            if "item_average_weight" in item_info:
                                pass  # TODO take care of the condition that an item is weighed in units
                        sum += self.convert_unit(container["unit"], container["weight"])
                item_info["sum"] = sum
                if "total_minimum" in item_info:
                    total_minimum = item_info["total_minimum"]
                    if sum <= total_minimum:
                        new_notification_level = ITEM_CRITICAL

                    if total_minimum < sum <= total_minimum * 2:
                        new_notification_level = ITEM_LOW

                if "total_maximum" in item_info:
                    total_maximum = item_info["total_maximum"]
                    if sum >= total_maximum:
                        new_notification_level = ITEM_OVER

                if "minimum_per_day" in item_info:
                    minimum_per_day = item_info["minimum_per_day"]
                    pass
                if "maximum_per_day" in item_info:
                    maximum_per_day = item_info["maximum_per_day"]
                    pass
                if active_notification != new_notification_level:
                    self.notify_clients(business_id, item_id, new_notification_level, updater)
                    item_info["active_notification"] = new_notification_level
        else:
            self.email_client.email_admin("Error loading item info",
                                          "Error loading item info business: "+ str(business_id)+" item: "+str(item_id))

    def notify_clients(self, business_id, item_id, notification_level,updater):
        """notify the clients connected that the a notification status """
        updater.add_notification(business_id, item_id, notification_level, remove_only=notification_level == -1)


    def convert_unit(self, source_unit, item_weight, target_unit=None):
        """convert units of items. if no target unit is entered so the system default is used
        (KG when writing this code)"""
        if target_unit is None:
            target_unit = self.dict_unit
        if source_unit == KG:
            if target_unit == KG: 
                pass
            elif target_unit == LB:
                item_weight *= 2.205
        elif source_unit == LB:
            if target_unit == KG:  
                item_weight /= 2.205
            elif target_unit == LB:  
                pass
        return item_weight

    def add_weight(self, business_id, item):
        pass

    @staticmethod
    def run_tasks():
        schedule.run_pending()


def routine_check(business_id):
    print("routine_check:", business_id)
