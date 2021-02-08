
from queries.read_queries import ReadQueries as readQ
from queries.create_queries import CreateQueries as createQ
from queries.update_queries import UpdateQueries as updateQ
from queries.delete_queries import DeleteQueries as deleteQ
import flask
from flask import request, jsonify
from flask_cors import CORS


app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
indexes = {
    "container_id": 0,
    "user_id": 0,
    "business_id": 0
}


@app.route('/get/containers', methods=['GET'])
def get_containers():
    """gets all current weight for all items of a specific business
         provided optional params: can get specific containers
        required parameters: business_id
        optional parameters: container_id """
    query, res_code = readQ.get_current_weight(request.args, get_by_container=True)
    return process_read_query(query, res_code)


@app.route('/get/current_weights', methods=['GET'])
def get_current_weight():
    """gets all current weight for all items of a specific business
     provided optional params: can get specific items by item id
    required parameters: business_id
    optional parameters: item_ids"""
    query, res_code = readQ.get_current_weight(request.args)
    return process_read_query(query, res_code)


@app.route('/get/preferences', methods=['GET'])
def get_user_preferences():
    """gets preferences for a specific user based on user_email
        required parameters: user_email
        optional parameters: none"""
    query, res_code = readQ.get_user_preferences(request.args)
    return process_read_query(query, res_code)


@app.route('/get/notifications', methods=['GET'])
def get_notifications():
    """gets all notifications based on business_id,
    provided optional params: can get only active notifications and a specific notification
            required parameters: business_id
            optional parameters: active ,notification_id
    """
    query, res_code = readQ.get_notifications(request.args)
    return process_read_query(query, res_code)


@app.route('/get/rules', methods=['GET'])
def get_rules():
    """gets all rules based on business_id,
provided optional params: can get only active rules and a specific rule
           required parameters: business_id
           optional parameters: active ,rule_id
           """
    query, res_code = readQ.get_rules(request.args)
    return process_read_query(query, res_code)


@app.route('/get/current_view', methods=['GET'])
def get_current_view():
    """gets all the info a user needs based on business_id,
        required parameters: business_id
        """

    weight_query, weight_code = readQ.get_current_weight(request.args)
    notifications_query, notifications_code = readQ.get_notifications(request.args)

    return process_read_query([[notifications_query, "notifications"], [weight_query, "weights"]], notifications_code)



# @app.route('/get/create', methods=['GET'])
# def create():
#     pass
#
#
# @app.route('/get/drop/all', methods=['GET'])
# def drop_tables():
#     pass
#
#
# @app.route('/get/add/dummy_data', methods=['GET'])
# def add_dummy():
#     pass


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p><p>" + str(e) + "</p>", 404


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Majordomo back end</h1>'''


def error_message(code, message, info=None):
    res = "<h1>" + str(code) + "</h1><p>" + str(message) + "</p>"

    if info:
        res += "<p>" + str(info) + "</p>"
    return res, code


def process_read_query(query, res_code):
    if res_code != 200:
        return query
    result, res_code = readQ.select_connection(query)
    if res_code == 200:
        return result
    else:
        return error_message(res_code, result, "unable to process request")
# @app.route('/get/restart', methods=['GET'])
# def restart_tables():
#     drop_tables()
#     print("*****************removed********************")
#     code, query = db_queries.add_table_code()
#     result, code = select_connection(query, False)
#     return str(code)


if __name__ == '__main__':
    app.run()
