
from backend.queries.read_queries import ReadQueries as readQ
from backend.queries.create_queries import CreateQueries as createQ
from backend.queries.update_queries import UpdateQueries as updateQ
from backend.queries.delete_queries import DeleteQueries as deleteQ

from psycopg2.extras import RealDictCursor
from flask import request, jsonify
from backend.config import config
import psycopg2
import flask
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
def get_current_weight():
    """gets all current weight for all items of a specific business
    required parameters: business_id
    optional parameters: container_id """
    return readQ.get_current_weight(request.args)


@app.route('/get/preferences', methods=['GET'])
def get_user_preferences():
    """gets preferences for a specific user based on user_email
        required parameters: user_email
        optional parameters: none"""
    return readQ.get_user_preferences(request.args)


@app.route('/get/notifications', methods=['GET'])
def get_notifications():
    """gets all notifications based on business_id,
    provided optional params: can get only active notifications and a specific notification
            required parameters: business_id
            optional parameters: active ,notification_id
    """
    return readQ.get_notifications(request.args)


@app.route('/get/rules', methods=['GET'])
def get_rules():
    """gets all rules based on business_id,
   provided optional params: can get only active rules and a specific rule
           required parameters: business_id
           optional parameters: active ,rule_id
           """
    return readQ.get_rules(request.args)


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




# @app.route('/get/restart', methods=['GET'])
# def restart_tables():
#     drop_tables()
#     print("*****************removed********************")
#     code, query = db_queries.add_table_code()
#     result, code = select_connection(query, False)
#     return str(code)


if __name__ == '__main__':
    app.run()