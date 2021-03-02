import React, { Component } from 'react';
import "./notifications.css"
import { base_url } from '../index'
// import fake_data from '../fake_data.json'
import $ from 'jquery'
import { Animation } from 'rsuite';
import { action_btn, notification_dict, category_symbols, category_colors, notification_colors } from './notifications_data';
import { Dictionary, getRTL } from '../Dictionary';
import { CategoryDrawer } from './drawer';
import v_icon from '../images/icons/v icon.svg'
import { ButtonsComponent } from './bars';
import { confirm_papulation } from './data_dictionary';
import { notifications_levels, action_symbol } from './notifications_data'


const { Collapse } = Animation;


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



// export class NotificationBlock extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             status: props.status,
//             notification_level: props.notification_level,
//             page: [],
//             action: props.action,
//             open: true

//         }
//     }

//     componentDidMount() {
//         this.setState({ page: <NotificationList key={"notification_list"} dict={this.props.dict} /> })
//     }
//     render() {

//         return (
//             <div id="first_notification" className="notificationblock">
//                 {this.state.page}
//             </div>

//         )
//     }
// }



//1
export class NotificationList extends Component {
    constructor(props) {
        super(props);
        this.render_by_category = this.render_by_category.bind(this);
        this.state = {
            page: [],
            temp: [{}, {}],
            categories: ["category", "supplier", "alerts"],
            dict: props.dict,
            index: 0
        }

    }

    render_by_category(i) {
        var cat = this.state.categories[i]
        var page = []
        if (this.state.dict["notifications"] && this.state.dict["weights"]) {
            var notifications_data = this.state.dict["notifications"][cat]
            var weights_dict = this.state.dict["weights"][cat]

            // confirm_papulation(weights_dict,"NotificationList","render_by_category missing weight attribute")
            // confirm_papulation(notifications_dict,"NotificationList","render_by_category missing notification attribute")

            if (cat === "alerts") {
                for (let i = 1; i <= notification_colors.length; i++) {
                    if (notifications_data && notifications_data[i]) {
                        page.push(<AlertNotifications notifications_level={i} notification_info={notifications_data[i]} />)
                    }
                }
                // var addition = <NotificationAlerts notification_dict={notifications_dict} />
                // page.push(addition)
            }
            else {
                Object.keys(weights_dict).forEach(category_id => {
                    var notifications = get_notifications_by_level(notifications_data, category_id)
                    var addition = <NotificationCategory key={"category" + cat + category_id} cat_type={cat} category_id={category_id} notification_data={notifications} weights_dict={weights_dict[category_id]} />
                    page.push(addition)
                })
            }
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
            notification_data: props.notification_data,
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
                    {(props, ref) => <Panel {...props} ref={ref} key={this.props.category_id + " panel " + this.props.cat_type} notifications={this.extract_items(this.props.notification_data)} />}
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
                action_btn: action_btn(props.defult_weight, notification_level, props.item_name, props.order_details),
                error_symbol: notification_dict[notification_level]["error_symbol"],
                color: notification_dict[notification_level]["color"],
                unit: props.unit ? props.unit : "kg"
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
                        <div dir={getRTL()}> {this.state.total_weight.toFixed(1).replace(/\.0+$/, '')} {" "} {Dictionary[this.state.unit]}</div>
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


class AlertNotifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }
    render() {
        let page = [],
        level = this.props.notifications_level,
        i = level-1,
        notifications = this.props.notification_info
        if (notifications&&level) {
            Object.keys(notifications).forEach(key => {
                var notification =  notifications[key]
                console.log(notification)
                page.push(<div className="simple_notification"><div className="cart_container">{action_btn(null, level-1, notification["item_name"], notification["order_details"])}</div>
                    {notification["item_name"]} <div class="center_items notification_weight"> {notification["total_weight"].toFixed(1).replace(/\.0+$/, '')} {notification["unit"]}</div>
                </div>)
            })
        }

        return (
            <div className="alert_notifications" style={{ backgroundColor: notification_colors[i] }}>
                <div className="simple_notification_header" onClick={() => this.setState({ show: !this.state.show })}>
                    <div><img className="header_symbols" src={notification_dict[level]["error_symbol"]} /></div>
                    <div>{notification_dict[level]["message"]}</div></div>
                <Collapse in={this.state.show} key={"notification_collapse" + level} >
                    {(props, ref) => <Panel {...props} ref={ref} key={"notification_panel" + level} notifications={page} />}
                </Collapse>


            </div>
        )
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



