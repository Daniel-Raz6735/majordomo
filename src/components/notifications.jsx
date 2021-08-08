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
import { ButtonsComponent } from './bars/bars';
import { confirm_papulation, getUnitById } from './data_dictionary';
import { notifications_levels } from './notifications_data';



const { Collapse } = Animation;


export function get_notifications(callback, client_id) {
    //request all notifications for a business
    var request = base_url + '/get/notifications';

    if (client_id) {
        request += "?business_id=" + client_id + "&active=true"

        $.ajax({
            url: request,
            success: function (res) {
                callback(res);

            },
            error: function (err) {

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

    var count = 0
    Object.keys(dict).forEach(key => {
        if (dict[key])
            count += Object.keys(dict[key]).length
    })

    return [dict, count]
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
                let preferences = this.props.dict["preferences"][0]
                let minimum_reach = preferences["minimum_reach_alerts"]
                let freshness = preferences["freshness_alerts"]

                for (let i = 1; i <= notification_colors.length; i++) {
                    if (!minimum_reach && i === 2)
                        continue

                    if (!freshness && i === 3)
                        continue

                    if (notifications_data && notifications_data[i]) {
                        page.push(<AlertNotifications key={"alert_not" + i} notifications_level={i} notification_info={notifications_data[i]} />)
                    }
                }
            }
            else {
                var temp = []
                Object.keys(weights_dict).forEach(category_id => {

                    var notifications = get_notifications_by_level(notifications_data, category_id) ? get_notifications_by_level(notifications_data, category_id)[0] : null
                    var notifications_size = get_notifications_by_level(notifications_data, category_id) ? get_notifications_by_level(notifications_data, category_id)[1] : 0


                    var addition = <NotificationCategory preferences={this.props.dict["preferences"][0]} key={"category" + cat + category_id} cat_type={cat} category_id={category_id} notification_data={notifications} weights_dict={weights_dict[category_id]} supplier_dict={this.props.dict["suppliers"]} />
                    temp.push([addition, notifications_size])

                    // page.push(addition)
                })
                temp.sort((a, b) => { return b[1] - a[1] })

                temp.forEach(not => {
                    page.push(not[0])
                })
            }

            // sort notification by the amount of notifications

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
export class NotificationCategory extends Component {
    constructor(props) {
        super(props);
        this.remove_onClick = this.remove_onClick.bind(this);
        this.extract_items = this.extract_items.bind(this);
        this.state = {
            page: [],
            show: true,
            category_id: props.category_id,
            notification_data: props.notification_data,
            weights_dict: props.weights_dict,
            supplier_dict: props.supplier_dict,
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
                let minimum_reach = this.props.preferences["minimum_reach_alerts"]
                let freshness = this.props.preferences["freshness_alerts"]

                if (!minimum_reach && notification_level == 2)
                    return

                if (!freshness && notification_level == 3)
                    return


                if (items_in_level) {

                    Object.keys(items_in_level).forEach(item_id => {
                        var item_info = items_in_level[item_id]

                        page.push(<Notification key={item_id + notification_level + "notification"}
                            notification_level={item_info["notification_level"]} item_name={item_info["item_name"]}
                            total_weight={item_info["total_weight"]} item_id={item_id}
                            supplier_id={item_info["supplier_id"]}
                            unit={getUnitById(item_info["unit"])} order_details={item_info["order_details"]} />)
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
                <NotificationHeader key={"header" + this.props.cat_type + this.props.category_id} cat_type={this.props.cat_type} on_click={this.remove_onClick} weights_dict={this.props.weights_dict} supplier_dict={this.props.supplier_dict} cat_id={this.props.category_id} />
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
                action_btn: action_btn(props.defult_weight, notification_level, props.item_name, props.order_details, this.props.item_id, this.props.supplier_id),
                error_symbol: notification_dict[notification_level]["error_symbol"],
                color: notification_dict[notification_level]["color"],
                unit: props.unit
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


export class AlertNotifications extends Component {
    //notification component for the alert area in the inventory page
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            keep_open: this.props.keep_open ? this.props.keep_open : false
        }

    }




    render() {

        let page = [],
            level = this.props.notifications_level > 0 ? this.props.notifications_level : "-1",
            i = level - 1 >= 0 ? level - 1 : -1,
            notifications = this.props.notification_info,
            color = i !== -1 ? notification_colors[i] : "rgb(115, 213, 4)";



        if (notifications && level) {
            Object.keys(notifications).forEach(key => {
                var notification = notifications[key],
                    total_weight = notification["total_weight"] ? notification["total_weight"].toFixed(1).replace(/\.0+$/, '') : -1
                page.push(<div key={"div" + key} className="simple_notification">
                    <div className="cart_container">
                        {action_btn(null, level, notification["item_name"], notification["order_details"], notification["item_id"], notification["suppliers"][0])}
                    </div>
                    <div className="center_items notification_item_name alert_notification_item_name">
                        {notification["item_name"]}
                    </div>
                    <div className="center_items notification_weight" style={{ direction: getRTL() }}>
                        {total_weight + " "}
                        {Dictionary[getUnitById(notification["unit"])]}
                    </div>
                </div>)
            })
        }
        let className = this.state.keep_open ? "alert_notifications item_drawer_alert_notifications" : "alert_notifications"

        return (
            <div className={className} style={{ backgroundColor: color }}>
                <div className="simple_notification_header" onClick={() => this.setState({ show: !this.state.show })}>
                    <div className="header_items" ><img className="header_symbols" alt="header symbol" src={notification_dict[level]["alert_filter_symbol"]} /></div>
                    {/* <div className="header_items" ><img className="header_symbols" alt="header symbol" src={notification_dict[level]["error_symbol"]} /></div> */}
                    <div className="header_items">{notification_dict[level]["message"]}</div></div>
                <Collapse in={this.state.show || this.state.keep_open} key={"notification_collapse" + level} >
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
                <div className="looks_good_card">{Dictionary["looks_good"]} </div>
                <NotificationSymbol key={"not_symbol"} color={"rgba(115, 213, 4, 0.21)"} error_symbol={v_icon} />
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
        style={{ width: '100%', overflow: 'hidden', paddingBottom: "7px" }}>
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
                page.push(<img key={"image" + key} className="header_symbols notification_toggler" src={notification_dict[notification_num]["error_symbol"]} alt="category symbol" />)
            }
        })
        this.setState({ page })

    }


    render() {
        var cat_id = this.props.cat_id - 1

        var supllier_name = this.props.supplier_dict["suppliers"][this.props.cat_id]
        var cat_name = (this.props.cat_type === "supplier") ? supllier_name["name"] : false

        // supplier case
        let symbol, style = {
            borderBottomColor: "gray",
            color: "unset"
        }

        // item type case
        if (!cat_name) {
            symbol = <img className="notification_toggler" src={category_symbols[cat_id]} alt="category symbol" />
            style = { borderBottomColor: category_colors[cat_id] }
        }


        return (
            <div className="notificationHeader notification_toggler" onClick={(e) => this.props.on_click(e)} style={style} >
                <CategoryDrawer key={this.props.cat_type + "drawer" + cat_id} weights_dict={this.props.weights_dict} cat_id={cat_id} cat_name={cat_name} />
                <div className="notification_header_middle notification_toggler">
                    {/* <img className="notification_toggler" src={category_symbols[cat_id]} alt="category symbol" />*/}
                    {symbol}
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



