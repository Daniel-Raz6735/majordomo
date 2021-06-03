import "./bars.css"
import inventory from '../../images/icons/inventory.svg'
import home from '../../images/icons/home.svg'
import cart from '../../images/icons/cart.svg'
import profile from '../../images/profile.svg'
import React, { Component } from 'react';
import { auth } from '../../config/firebaseConfig'
import { Dictionary, getTime } from '../../Dictionary';
import InventoryPage from "../../pages/inventory_page"
import OrdersPage from "../../pages/orders_page"
import { Button, Loader } from 'rsuite';
import { create_initial_data_dict, confirm_papulation } from '../data_dictionary';
import SettingPage from "../../pages/settings_page"
import { base_url, wssUrl } from '../../index'
import $ from 'jquery'
import HomePage from "../../pages/home page/home_page"
import { Notification as scrren_notification } from "rsuite";
import export_list from '../../images/icons/orders/export_list.svg'
var socket_client = require('websocket').w3cwebsocket;

export var main_dict, update = 0


var xDown = null;
var yDown = null;
var tab_index = 0
var tabs = ["HomePage", "InventoryPage", "OrdersPage", "SettingPage"]



export class SiteFrame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttons: ["bottom_bar active", "bottom_bar", "bottom_bar", "bottom_bar"],
            page: <Loader speed="fast" size="lg" content="Loading..." center vertical />,


        }
        this.change_tab = this.change_tab.bind(this);
        this.send_msg = this.send_msg.bind(this);
        this.process_initial_data = this.process_initial_data.bind(this);
        this.loadSite = this.loadSite.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.getTouches = this.getTouches.bind(this);

    }
    componentDidMount() {


        var wss = new socket_client(wssUrl)
        wss.onopen = function () { console.log('wss open'); };
        wss.onmessage = (message) => {
            websocket_notify(message)
        }
        this.setState({ socket: wss });

        var tab_name = sessionStorage.getItem('tab_name') ? sessionStorage.getItem('tab_name') : "";
        this.setState({ tab_name: tab_name });
        sessionStorage.removeItem('tab_name');

        this.loadSite(1, tab_name, false);

        //establishing a way for chield components to switch tabs across the app
        $("#reset_frame").change(() => { })
        $("#silent_refresh").change(() => { this.loadSite(1, null) })
        $("#refresh").change(() => { this.loadSite(1, this.state.tab_name) })


    }
    send_msg() {
        //web socket message send test
        this.state.socket.send(JSON.stringify({
            type: "message",
            msg: 1
        }));

    }

    process_initial_data(data, tab_name, saveTab = true) {
        // load the site with assential basic data for the basic site 

        // download(JSON.stringify(data) , 'data.json', 'text/plain');
        if (typeof (data) == "object") {
            main_dict = create_initial_data_dict(data);
            // var dict = create_initial_data_dict(data);
            // download(JSON.stringify(main_dict) , 'dict.json', 'text/plain');
            if (!main_dict) {
                this.setState({ page: <PageNotFound status_code={500} /> })
                console.log("Data rcived from server is corrupt")
            }
            else {
                update++;
                confirm_papulation(main_dict, "process_initial_data", "initial data not recived well")
                if (tab_name !== null)
                    this.change_tab(tab_name, saveTab)
                // download(JSON.stringify(main_dict) , 'dict.json', 'text/plain');

                if (main_dict["preferences"]) {
                    sessionStorage.setItem("developer", main_dict["preferences"]["developer"])
                }
            }
        }
        else {
            console.log("intial data returnd with bad body")
        }
    }

    loadSite(business_id, tab_name, saveTab = true) {
        //request all information for a business
        var request = base_url + '/get/current_view',
            thisS = this;
        if (business_id) {
            request += "?business_id=" + business_id

            $.ajax({
                url: request,
                success: function (res) {
                    thisS.process_initial_data(res, tab_name, saveTab);
                },
                error: function (err) {
                    thisS.setState({ page: <PageNotFound status_code={500} /> });
                }
            });
        }
        else {
            console.log("no user id enterd. nothing happend")
        }

    }
    change_tab(tab_name, saveTab = true) {
        //changes the tab on this component by name
        var page = [], i = 0, dict = main_dict, key = tab_name + update;

        switch (tab_name) {
            case "SettingPage":
                i = 3;
                page = <SettingPage key={key} dict={dict} />
                break;

            case "OrdersPage":
                i = 2;
                page = <OrdersPage key={key} update={update} dict={dict} />
                break;

            case "InventoryPage":

                i = 1;
                page = <InventoryPage key={key} dict={dict} />
                break;

            case "HomePage":
            default:
                i = 0;
                page = <HomePage key={key} dict={dict} />
                break;
        }
        var buttons = ["bottom_bar", "bottom_bar", "bottom_bar", "bottom_bar"]
        buttons[i] = "bottom_bar active"
        this.setState({
            buttons: buttons,
            page: page,
            tab_name: tab_name
        })
        if (saveTab)
            sessionStorage.setItem("tab_name", tab_name)
    }



    getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    handleTouchStart(evt) {
        const firstTouch = this.getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* left swipe */
                if (tab_index + 1 < 4) {
                    tab_index++
                    this.change_tab(tabs[tab_index])
                }
            } else {
                if (tab_index > 0) {
                    tab_index--
                    this.change_tab(tabs[tab_index])
                }
                /* right swipe */
            }
        }

        /* reset values */
        xDown = null;
        yDown = null;
    };

    render() {



        return (

            <div className="main_user_page_container"   >
                <AlertManeger />
                <div className="site_data_cover" onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove}  >
                    {this.state.page}
                </div>
                <footer id="footer_bar">
                    <div className="description" onClick={() => { this.change_tab("HomePage") }}>
                        <img alt="Home" className="bottom-bar-btn" src={home} />
                        <div className={this.state.buttons[0]}><div className="tester">{Dictionary["home"]}</div></div>
                    </div>
                    <div className="description" onClick={() => this.change_tab("InventoryPage")}>
                        <img alt="Inventory" className="bottom-bar-btn" src={inventory} />
                        <div className={this.state.buttons[1]}>
                            <div className="tester">{Dictionary["inventory"]}</div>
                        </div>
                    </div>

                    <div className="description" onClick={() => { this.change_tab("OrdersPage") }}>
                        <img alt="Cart" className="bottom-bar-btn" src={cart} />
                        <div className={this.state.buttons[2]}>
                            <div className="tester">{Dictionary["orders"]}</div>
                        </div>
                    </div>

                    <div className="description" onClick={() => this.change_tab("SettingPage")}>
                        <img alt="Profile" className="bottom-bar-btn" src={profile} />
                        <div className={this.state.buttons[3]} >
                            <div className="tester">{Dictionary["profile"]}</div>
                        </div>
                    </div>
                    {/* this input is used for switching tabs in the app */}
                    <input type="hidden" id="reset_frame" name="reset_frame" value="" />
                    {/* this input is used for refreshing the data the app without refreshing the components */}
                    <input type="hidden" id="silent_refresh" name="silent_refresh" value="" />
                    {/* this input is used for refreshing the data the app and refreshes the components */}
                    <input type="hidden" id="refresh" name="refresh" value="" />
                </footer>
            </div>

        )

    }
}

export function websocket_notify(message) {
    const dataFromServer = JSON.parse(message.data);
    console.log(dataFromServer)

    if (dataFromServer && dataFromServer["cat"]) {
        const cat = dataFromServer["cat"]
        console.log(dataFromServer)
        switch (cat) {
            case "notification":
                var level = dataFromServer["notification level"], item_id = dataFromServer["item id"] ? dataFromServer["item id"] : "", weight = dataFromServer["new weight"]
                if(main_dict&&main_dict["items"] && main_dict["items"][item_id] &&main_dict["items"][item_id]["item_name"])
                    item_id = main_dict["items"][item_id]["item_name"]
                switch (level) {
                    case "1":
                        showNotification('warning', "notification changed", "Item " + item_id + " turned critical");
                        break;
                    case "2":
                        showNotification('warning', "notification changed", "Item " + item_id + " is low");
                        break;
                    case "3":
                        showNotification('warning', "notification changed", "Item " + item_id + " is Overflowing. Use quickly");
                        break;
                    default:
                    case "-1":
                        break;
                }

                break;
            case "weight":

                break;

            default:
                break;
        }
    }
    refresh()
}
export function silent_refresh() {
    //refresh the site data using the silent trigger
    $("#silent_refresh").val("").change();
}

export function refresh() {
    //refresh the site data using the trigger
    $("#refresh").val("").change();
}


export class TitleComponent extends Component {
    render() {
        return <div className="page_title">{Dictionary[this.props.title_name] + " | " + getTime()}</div>;
    }
}

export class PageNotFound extends Component {

    render() {
        var status_code = ""
        if (this.props["status_code"])
            status_code += Dictionary["status_code"] + ": " + this.props["status_code"]
        return <div className="page_not_found">{Dictionary["page_not_found"] + "."} <br /> {status_code}</div>;
    }
}

export class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }


    componentDidMount() {

    }

    render() {

        return (
            <header className="header">
                {/* <LangBtn /> */}
                {/* <img alt="Majordomo logo" className="majordomoLogo" src={logo} onClick={() => { window.location = '/'; }}></img> */}

                <Button color="red" id="logoutBtn" onClick={() => {
                    auth.signOut()
                    window.location.reload()
                }} >{Dictionary.signOut}</Button>
            </header>
        );

    }
}


export class ButtonsComponent extends Component {
    //a component that will open a number of buttons (1-3) that toggle between categories
    constructor(props) {
        super(props);
        this.state = {
            btns: [],
            btn_styles: [{}, {}, {}]
        }
        this.btn_handler = this.btn_handler.bind(this);
    }

    componentDidMount() {
        var def_btn = this.props.def_btn ? this.props.def_btn : 0
        this.btn_handler(def_btn)
    }

    btn_handler(i) {
        //switches the button collor and initiates the props callback
        var red_style = { background: "#FD4141", color: "#FFFFFF", border: "0px" },
            defult_style = { background: "none", color: "#707070", border: "1px solid #707070" }
        var btn_styles = [defult_style, defult_style, defult_style]
        btn_styles[i] = red_style
        this.setState({ btn_styles });
        this.props.callback(i);
    }


    render() {
        let btn_names = this.props.btn_names,
            btns = [],
            width = 0
        for (let i = 0; i < btn_names.length; i++) {
            btns.push(<button className="toolbar_btn" key={"toolbar" + i} onClick={() => this.btn_handler(i)} style={this.state.btn_styles[i]} >{Dictionary[btn_names[i]]}</button>);
            width += 33;
        }

        let list = this.props.orders ? <img src={export_list} alt="export" onClick={this.props.export_func} /> : ""
        return (<div className="toolbar_buttons" style={{ width: width + "%" }}>
            {btns}
            {list}
        </div>);
    }
}


//this component contains an alert manager to show user notifications.Usage: enter information in the non trigger inputs and then trigger a change in the notification trigger
export class AlertManeger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: {}
        }
        this.showNotification = this.showNotification.bind(this);
        this.notificationOnScreen = this.notificationOnScreen.bind(this);

    }
    componentDidMount() {
        //establishing a way for chield components to switch tabs across the app
        $("#notification_trigger").change(() => {
            this.showNotification();
        })
        $("#notification_close_triger").change(() => {
            console.log('removing one')
            scrren_notification.close();
        })
        $("#notification_close_all_triger").change(() => {
            scrren_notification.closeAll();
            console.log('removing all');
        })

    }
    showNotification() {
        var symbol = $("#notification_alert_symbol").val(),
            title = $("#notification_alert_title").val(),
            description = $("#notification_alert_content").val(),
            key = title + description
        if (!this.notificationOnScreen(key)) {
            scrren_notification[symbol]({
                title: title,
                description: description,
                onClose: () => { this.removeNotificationFromState(key) }
            })
        }

    }

    notificationOnScreen(key, repeat = false) {
        //test if key is on the screen and adds a  
        var active = this.state.active
        if (active.hasOwnProperty(key) && !repeat)
            return true;
        else
            active[key] = true;
        this.setState({ active: active })
        return false;
    }
    removeNotificationFromState(key) {
        var active = this.state.active
        if (active.hasOwnProperty(key))
            delete active[key]
        this.setState({ active })

    }

    render() {
        return (
            <div className="alert_manger">
                <input type="hidden" id="notification_trigger" name="" value="" />
                <input type="hidden" id="notification_close_triger" />
                <input type="hidden" id="notification_close_all_triger" />
                <input type="hidden" id="notification_alert_symbol" name="notification_alert_symbol" value="" />
                <input type="hidden" id="notification_alert_title" name="notification_alert_title" value="" />
                <input type="hidden" id="notification_alert_content" name="notification_alert_content" value="" />
                <div id={"extra_notification_content"} style={{ "display": "none" }}>
                    {/* this div will contain any notification content that is wanted */}
                </div>
            </div>

        );

    }
}

export function showNotification(notificationType, title, description) {
    //collect the information from the feilds and trigger a notification
    $("#notification_alert_symbol").val(notificationType ? notificationType : "");
    $("#notification_alert_title").val(title ? title : "");
    $("#notification_alert_content").val(description ? description : "");
    //set notification to turn on
    $("#notification_trigger").val("").change();
}
export function replaceNotification(notificationType, title, description) {
    showNotification(notificationType, title, description);
}
export function removeOneNotification() {
    //remove active notifcation from the screen
    $("#notification_close_triger").val("").change();
}
export function removeAllNotifications() {
    //remove all active notifcation from the screen
    $("#notification_close_all_triger").val("").change();
}



function download(content, fileName, contentType) {
    /*download a site information from the code to file*/
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}