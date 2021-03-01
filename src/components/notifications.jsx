import React, { Component } from 'react';
import "./notifications.css"
import { base_url } from '../index'
import fake_data from '../fake_data.json'
import $ from 'jquery'
import { Animation, Loader } from 'rsuite';
import { action_btn, notification_dict, category_symbols, category_colors } from './notifications_data';
import { Dictionary, getRTL } from '../Dictionary';
import { CategoryDrawer } from './drawer';
import v_icon from '../images/icons/v icon.svg'
import { ButtonsComponent } from './bars';


const { Collapse } = Animation;
const notifications_levels = [3, 2, 1]

export function get_notifications(callback, client_id) {
    //request all notifications for a business
    var request = base_url + '/get/notifications';

    if (client_id) {
        request += "?business_id=" + client_id + "&active=true"
        console.log(request)
        $.ajax({
            url: request,
            success: function (res) {
                callback(res);
                console.log(res)
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
    else {
        console.log("no user id enterd. nothing happend")
    }

}


export function process_notifications(data, success) {
    // var page = []
    if (typeof (data) == "object") {
        console.log(data)
        // var dict = create_notification_dict(data);      
        // ReactDOM.render( <NotificationList dict = {dict} />,document.getElementById('first_notification'))
    }


}

function confirm_papulation(dict, area_name, message = "", dict_to_test = false) {
    message = message ? "\nmessage: " + message : "";
    var not_found_keys = [];
    if (dict) {
        Object.keys(dict).forEach(key => {
            if (dict_to_test) {
                if (dict_to_test.includes(key))
                    not_found_keys.push(key)
            }
            else if (!dict[key])
                not_found_keys.push(key)
        })

        if (not_found_keys) {
            var keys = ""
            not_found_keys.forEach(key => { keys += key + ", " })
            // console.log("couldent find "+keys+" in "+area_name + message)
            return keys
        }
    }
    else {

        // console.log("no dictionary recived" + area_name + message)
    }

}

function create_initial_data_dict(data) {
    //this function gets a response from the server and breaks it down to 4 dictionary 
    var dict = {}
    if (data) {
        // console.log(data)
        dict["orders"] = create_orders_dict(data["orders"])
        dict["suppliers"] = create_suppliers_dict(data["suppliers"], dict["orders"])
        dict["notifications"] = create_notification_dict(data["notifications"], dict["suppliers"], dict["orders"])
        dict["weights"] = create_weights_dict(data["weights"], dict["suppliers"], dict["notifications"], dict["orders"])
        // console.log(dict)
        // download(JSON.stringify(dict) , 'dict.json', 'text/plain');
        confirm_papulation(dict, "create_initial_data_dict", "feild not recived from server")
        if (!dict["weights"]) {
            console.log("no weights for user")
            return null
        }
        return dict
    }
    else
        console.log("create_initial_data_dict no data recived")
}


function create_notification_dict(notification_data, suppliers_data, orders_dict) {
    var dict =
    {
        "category": {},
        "supplier": {}
    }

    confirm_papulation(suppliers_data, "suppliers_data create_notification_dict")
    if (!notification_data)
        return null
    Object.keys(notification_data).forEach(key => {
        var notification = notification_data[key]
        if (notification) {
            confirm_papulation(notification, "create_notification_dict")
            var item_name = notification["item_name"],
                item_id = notification["item_id"],
                category_name = notification["category_name"],
                category_id = notification["category_id"],
                notification_level = notification["code"],
                item_weight = notification["weight"],
                date = notification["date"],
                active = notification["active"],
                unit = notification["unit"],
                notification_to_insert = {
                    "notification_level": notification_level,
                    "item_name": item_name,
                    "item_id": item_id,
                    "total_weight": item_weight,
                    "unit":unit,
                    "date": date,
                    "active": active
                },
                suppliers_id = false;
            if (orders_dict && orders_dict["items"] && orders_dict["items"][item_id])
                notification_to_insert["order_details"] = orders_dict["items"][item_id]

            if (suppliers_data && suppliers_data["items"] && suppliers_data["items"][item_id]) {
                suppliers_id = suppliers_data["items"][item_id]["suppliers"]
                if (suppliers_id)
                    notification_to_insert["suppliers"] = suppliers_data["suppliers"][suppliers_id]
            }



            if (item_name && item_id && category_name && category_id && notification_level !== undefined && notification_level !== null && item_weight !== undefined && item_weight !== null) {
                if (!dict["category"][notification_level])
                    dict["category"][notification_level] = {}
                if (!dict["category"][notification_level][category_id])
                    dict["category"][notification_level][category_id] = {}
                dict["category"][notification_level][category_id][item_id] = { ...notification_to_insert };

                suppliers_id.forEach(supplier_id => {
                    if (!dict["supplier"][notification_level])
                        dict["supplier"][notification_level] = {}
                    if (!dict["supplier"][notification_level][supplier_id])
                        dict["supplier"][notification_level][supplier_id] = {}
                    dict["supplier"][notification_level][supplier_id][item_id] = { ...notification_to_insert };
                })
            }

        }
    });
    return dict
}

function create_weights_dict(weight_data, suppliers_data, notifications_data, orders_dict) {
    var dict =
    {
        "category": {},
        "supplier": {}
    }
    confirm_papulation(suppliers_data, "suppliers_data create_weights_dict")
    confirm_papulation(notifications_data, "notifications_data create_weights_dict")
    if (!weight_data)
        return null
    Object.keys(weight_data).forEach(key => {
        var element = weight_data[key]
        if (element) {
            confirm_papulation(element, "create_weights_dict")
            var item_name = element["item_name"],
                item_id = element["item_id"],
                category_id = element["category_id"],
                category_name = element["category_name"],
                notification_level = -1
            if (item_name && item_id && category_id && category_name) {
                if (!dict["category"][category_id])
                    dict["category"][category_id] = {}
                if (notifications_data && notifications_data["category"]) {
                    var cat = notifications_data["category"]
                    if (cat)
                        notifications_levels.forEach(level => {
                            if (cat[level] && cat[level][category_id] && cat[level][category_id][item_id])
                                notification_level = level
                        })
                }
                var weight_info = {
                    "cat_name": category_name,
                    "date": element["date"],
                    "item_name": item_name,
                    "total_weight": element["weight"],
                    "notification_level": notification_level,
                    "suppliers": []
                }
                if (orders_dict && orders_dict["items"] && orders_dict["items"][item_id])
                    weight_info["order_details"] = orders_dict["items"][item_id]
                dict["category"][category_id][item_id] = { ...weight_info }
                if (suppliers_data && suppliers_data["items"] && suppliers_data["items"][item_id] && suppliers_data["items"][item_id]["suppliers"]) {
                    var suppliers = suppliers_data["items"][item_id]["suppliers"]
                    suppliers.forEach(supplier_id => {
                        if (suppliers_data["suppliers"] && suppliers_data["suppliers"][supplier_id]) {
                            dict["category"][category_id][item_id]["suppliers"].push(supplier_id)
                            var supplier_name = suppliers_data["suppliers"][supplier_id]["name"]



                            if (!dict["supplier"][supplier_id])
                                dict["supplier"][supplier_id] = {}
                            if (supplier_name) {
                                weight_info["cat_name"] = supplier_name
                                dict["supplier"][supplier_id][item_id] = weight_info
                            }


                        }
                    });
                }
            }
        }
    });
    return dict
}
function create_suppliers_dict(suppliers_data, orders_dict) {
    var dict = {
        "items": {},
        "suppliers": {}
    }
    if (!suppliers_data)
        return null
    Object.keys(suppliers_data).forEach(key => {
        var element = suppliers_data[key]
        if (element) {
            var supplier_info = {},
                temp = {
                    "address": element["address"],
                    "email": element["email_user_name"] + "@" + element["email_domain_name"],
                    "name": element["first_name"] + " " + element["last_name"],
                    "phone_number": element["phone_number"],
                    "preferred_contact": element["preferred_contact"],
                },
                supplier_id = element["supplier_id"],
                item_id = element["item_id"],
                item_info = {
                    "supplier_id": supplier_id,
                    "providing_days": element["days_to_provide"],
                    "frequency": element["frequency"]
                }
            if (orders_dict && orders_dict["items"] && orders_dict["items"][item_id])
                item_info["order_details"] = orders_dict["items"][item_id]

            if (!element["email_user_name"] || !element["email_domain_name"])
                temp["email"] = null
            if (!element["first_name"] || !element["last_name"])
                temp["name"] = null


            Object.keys(temp).forEach(key => {
                if (temp[key])
                    supplier_info[key] = temp[key]
            })
            supplier_info["sells_items"] = {}


            if (item_id && supplier_id && element["frequency"] && element["days_to_provide"]) {
                if (!dict["items"][item_id])
                    dict["items"][item_id] = { "suppliers": [] }
                if (!dict["items"][item_id]["suppliers"].includes(supplier_id))
                    dict["items"][item_id]["suppliers"].push(supplier_id)

                if (!dict["suppliers"][supplier_id])
                    dict["suppliers"][supplier_id] = supplier_info
                dict["suppliers"][supplier_id]["sells_items"][item_id] = item_info

            }
            else {
                console.log("missing objects for " + key + " create_suppliers_dict found: supplier_id:" + supplier_id + " ,item_id:" + item_id + " , frequency: " + element["frequency"] + " , providing_days: " + element["days_to_provide"])
            }
        }
    });
    return dict
}
function create_orders_dict(orders_data) {
    var dict = {
        "items": {},
        "suppliers": {}
    }
    if (!orders_data)
        return null
    console.log(orders_data)
    var suppliers = dict["suppliers"],
        items = dict["items"]
    Object.keys(orders_data).forEach(key => {
        var element = orders_data[key]
        if (element && element["supplier_id"]) {
            let supplier_id = element["supplier_id"],
                item_id = element["item_id"],
                amount = element["amount"],
                unit = element["unit"]
            if (supplier_id && item_id && amount && unit) {

                if (!suppliers[supplier_id])
                    suppliers[supplier_id] = {}
                suppliers[supplier_id][item_id] = {
                    "amount": amount,
                    "unit": unit
                }
                items[item_id] = {
                    "amount": amount,
                    "unit": unit
                }


            }
            else {
                console.log("missing objects for " + supplier_id + " create_orders_dict found: item_id: " + item_id + " amount: " + amount + " unit: " + unit)
            }
        }
    });
    return dict
}


function get_notifications_by_level(notifications_dict, category_id) {
    var dict = {}
    if (notifications_dict && category_id) {
        notifications_levels.forEach(level => {
            if (notifications_dict[level] && notifications_dict[level][category_id])
                dict[level] = notifications_dict[level][category_id]
        })
    }
    if (Object.keys(dict).length === 0)
        return null
    return dict
}


//1
export class NotificationList extends Component {
    constructor(props) {
        super(props);
        this.render_by_category = this.render_by_category.bind(this);
        this.state = {
            page: [],
            temp: [{}, {}],
            categories: ["category", "supplier"],
            dict: props.dict,
            index: 0
        }

    }
    componentDidMount() {
    }

    render_by_category(i) {
        var cat = this.state.categories[i]
        var page = []
        if (this.state.dict["notifications"] && this.state.dict["weights"]) {
            var notifications_dict = this.state.dict["notifications"][cat]
            var weights_dict = this.state.dict["weights"][cat]

            // confirm_papulation(weights_dict,"NotificationList","render_by_category missing weight attribute")
            // confirm_papulation(notifications_dict,"NotificationList","render_by_category missing notification attribute")

            Object.keys(weights_dict).forEach(category_id => {
                var notifications = get_notifications_by_level(notifications_dict, category_id)
                var addition = <NotificationCategory key={"category" + cat + category_id} cat_type={cat} category_id={category_id} notification_dict={notifications} weights_dict={weights_dict[category_id]} />
                page.push(addition)
            })
            this.setState({ page });

        }
        else {
            console.log("no notifications sent to NotificationList")
        }
    }

    render() {
        return (
            <div className="notification_cover">
                <ButtonsComponent key="notification_btns" btn_names={["item_type", "supplier", "alerts"]} callback={this.render_by_category} />
                {this.state.page}
            </div>
        )
    }

}

//2
class NotificationCategory extends Component {
    constructor(props) {
        super(props);
        this.remove_onClick = this.remove_onClick.bind(this);
        this.extract_items = this.extract_items.bind(this);
        this.state = {
            page: [],
            show: true,
            category_id: props.category_id,
            notification_dict: props.notification_dict,
            weights_dict: props.weights_dict
        };

    }

    remove_onClick(e) {
        if (e && $(e.target).attr('class')) {

            if ($(e.target).attr('class').includes('notification_toggler')) {
                this.setState({ show: !this.state.show });
            }
        }
        else
            console.log("no e target enterd")
    }

    //extract the items in to Notification components if there are no notifications 
    extract_items(notification_data) {
        var page = []
        if (notification_data) {
            confirm_papulation(notification_data, "extract items NotificationCategory")
            Object.keys(notification_data).forEach(notification_level => {
                var items_in_level = notification_data[notification_level]

                if (items_in_level) {
                    Object.keys(items_in_level).forEach(item_id => {
                        var obj = items_in_level[item_id]
                        page.push(<Notification key={item_id + notification_level + "notification"} notification_level={obj["notification_level"]} item_name={obj["item_name"]} total_weight={obj["total_weight"]} item_id={item_id} unit={obj["unit"]} order_details={obj["order_details"]} />)
                    })
                }
            })
        }
        else
            page.push(<OKNotification key={"ok" + this.state.category_id} />)
        return page;
    }

    render() {
        return (
            <div className="notification_category_container">
                <NotificationHeader key={"header" + this.props.cat_type + this.props.category_id} cat_type={this.props.cat_type} on_click={this.remove_onClick} weights_dict={this.props.weights_dict} cat_id={this.props.category_id} />
                <Collapse in={this.state.show} key={this.props.category_id + "collapse" + this.props.cat_type} >
                    {(props, ref) => <Panel {...props} ref={ref} key={this.props.category_id + " panel " + this.props.cat_type} notifications={this.extract_items(this.props.notification_dict)} />}
                </Collapse>
            </div>
        );
    }
}


//3
export class Notification extends Component {

    constructor(props) {
        super(props);
        var notification_level = props.notification_level
        if (!notification_dict[notification_level]) {
            console.log("no notification configerd for notification_level " + notification_level)
        }
        else
            this.state = {
                notification_level: notification_level,
                item_name: props.item_name,
                total_weight: props.total_weight,
                message: props.message ? props.message : notification_dict[notification_level]["message"],
                action_btn: action_btn(props.defult_weight, notification_level, props.item_name, props.order_details ),
                error_symbol: notification_dict[notification_level]["error_symbol"],
                color: notification_dict[notification_level]["color"],
                unit:props.unit?props.unit:"kg"
            }
    }

    render() {
        if (this.state) {
            return (
                <div className="notification_container">
                    <div className="center_items left_notification_area">
                        {this.state.action_btn}
                    </div>
                    <div className="center_items notification_item_name clamp_line">
                        {this.state.item_name}
                    </div>
                    <div className="center_items notification_weight" >
                        <div dir={getRTL()}> {this.state.total_weight.toFixed(1).replace(/\.0+$/,'')} {" "} {Dictionary[this.state.unit]}</div>
                    </div>

                    <div className="notification_message center_items clamp_line ">
                        {this.state.message}
                    </div>
                    <NotificationSymbol key={this.props.item_id + "symbol"} color={this.state.color} error_symbol={this.state.error_symbol} />
                </div>
            )
        }
        else
            return <div></div>
    }
}
export class OKNotification extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="notification_container">
                <div className="">{Dictionary["looks_good"]}  </div>
                <NotificationSymbol color={"rgba(115, 213, 4, 0.21)"} error_symbol={v_icon} />
            </div>
        )
    }
}


//3 container
const Panel = React.forwardRef(({ ...props }, ref) => (
    <div
        {...props}
        ref={ref}
        id="notification_collapse"
        style={{ width: '100%', overflow: 'hidden' }}>
        {props.notifications}
    </div>
));

//Panels button
export class NotificationHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weights_dict: props.weights_dict,
            page: []

        }
    }

    componentDidMount() {

        let dict = this.props.weights_dict
        let temp = -999
        let page = []

        Object.keys(dict).forEach(key => {
            let notification_num = dict[key]["notification_level"]
            if (notification_num !== -1 && temp !== notification_num) {
                temp = notification_num
                page.push(<img className="header_symbols notification_toggler" src={notification_dict[notification_num]["error_symbol"]} alt="category symbol" />)
            }
        })
        this.setState({ page })
    }


    render() {
        var cat_id = this.props.cat_id - 1


        return (
            <div className="notificationHeader notification_toggler" onClick={(e) => this.props.on_click(e)} style={{ borderBottomColor: category_colors[cat_id] }} >
                <CategoryDrawer key={this.props.cat_type + "drawer" + cat_id} weights_dict={this.props.weights_dict} cat_id={cat_id} />
                <div className="notification_header_middle notification_toggler">
                    <img className="notification_toggler" src={category_symbols[cat_id]} alt="category symbol" />
                </div>
                <div className="notification_header_symbols notification_toggler">
                    {this.state.page}
                </div>
            </div>

        )
    }
}


export class NotificationBlock extends Component {

    constructor(props) {
        super(props);
        this.get_initial_data = this.get_initial_data.bind(this);
        this.process_initial_data = this.process_initial_data.bind(this);
        this.state = {
            status: props.status,
            notification_level: props.notification_level,
            page: <Loader speed="fast" size="lg" content="Loading..." center vertical />,
            action: props.action,
            open: true

        }
    }

    get_initial_data(callback, business_id) {
        //request all information for a business
        var request = base_url + '/get/current_view';

        if (business_id) {
            request += "?business_id=" + business_id + "&active=true"
            console.log(request)
            $.ajax({
                url: request,
                success: function (res) {
                    callback(res, true);
                    // console.log(res)
                },
                error: function (err) {
                    callback(fake_data, true);
                    console.log(err)
                }
            });
        }
        else {
            console.log("no user id enterd. nothing happend")
        }

    }

    process_initial_data(data, success) {
        if (success) {
            // download(JSON.stringify(data) , 'file.json', 'text/plain');
            if (typeof (data) == "object") {
                var dict = create_initial_data_dict(data);
                if (!dict)
                    this.setState({ page: <div> we encounterd a problem in loading data</div> })

                else {
                    confirm_papulation(dict, "process_initial_data", "initial data not recived well")
                    this.setState({ page: <NotificationList key={"notification_list"} dict={dict} /> })
                }
            }
            else {
                console.log("intial data returnd with bad body")
            }
        }
        else
            this.setState({ page: <div> we encounterd a problem in loading data</div> })
    }

    componentDidMount() {
        this.get_initial_data(this.process_initial_data, 1)
    }
    render() {


        return (
            <div id="first_notification" className="notificationblock">
                {this.state.page}
            </div>

        )
    }



}


//reresents the corner of a notification with a symbol
export const NotificationSymbol = (props) => {
    var symbol = props.error_symbol,
        color = { "backgroundColor": props.color }

    return (
        <div className="notification_symbol_area center_items" style={color}>
            <img alt="symbols" src={symbol} className="notification_symbol"></img>
        </div>
    )
}



// function download(content, fileName, contentType) {
//     var a = document.createElement("a");
//     var file = new Blob([content], { type: contentType });
//     a.href = URL.createObjectURL(file);
//     a.download = fileName;
//     a.click();
// }
