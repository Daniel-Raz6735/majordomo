import "./bars.css"
import inventory from '../images/icons/inventory.svg'
import home from '../images/icons/home.svg'
import cart from '../images/icons/cart.svg'
import profile from '../images/profile.svg'
import React, { Component } from 'react';
import { auth } from '../config/firebaseConfig'
import { Dictionary, LangBtn } from '../Dictionary';
import logo from '../images/icons/Majordomo logo.svg';
import InventoryPage from "../pages/inventory_page"
import OrdersPage from "../pages/orders_page"
import { NotificationBlock } from "./notifications"
import SettingPage from "../pages/settings_page"
import $ from 'jquery'
var socket_client = require('websocket').w3cwebsocket;


export class SiteFrame extends Component {

    constructor(props) {
        super(props);

        this.state = {
            buttons: ["bottom_bar active", "bottom_bar", "bottom_bar", "bottom_bar"],
            page: []

        }
        this.change_tab = this.change_tab.bind(this);
        this.send_msg = this.send_msg.bind(this);

    }
    componentDidMount() {

        // const ws = new socket_client('ws://127.0.0.1:8000/1/1');
        // var ws = new socket_client('ws://127.0.0.1:8000/ws/1/1', 'foo', 'http://127.0.0.1:8000');
        var ws = new socket_client('wss://majordomo.cloudns.asia/ws/1/1');
        // var ws = new socket_client('ws://127.0.0.1:8000/ws/1/1');


        ws.onopen = function () { console.log('ws open'); };
        ws.onmessage = (message) => {
            // const dataFromServer = JSON.parse(message.data);
            console.log('got reply! ' + message.data);
            // this.change_tab(this.state.component_name);
            window.location.reload()
        }
        console.log(ws)
        this.setState({ socket: ws });



        //establishing a way for chield components to switch tabs across the app
        $("#reset_frame").change(() => { console.log(this.change_tab($("#reset_frame").val())) })
        this.change_tab(this.props.page)
    }
    send_msg() {
        this.state.socket.send(JSON.stringify({
            type: "message",
            msg: 1
        }));

    }
    change_tab(component_name) {
        //changes the tab on this component by name
        var page = [], i = 0
        switch (component_name) {
            case "SettingPage":
                i = 3;
                page = <SettingPage />
                break;

            case "OrdersPage":
            default:
                i = 2;
                page = <OrdersPage />
                break;

            case "InventoryPage":

                i = 1;
                page = <InventoryPage />
                break;

            case "NotificationBlock":
                i = 0;
                page = <NotificationBlock />
                break;
        }
        var buttons = ["bottom_bar", "bottom_bar", "bottom_bar", "bottom_bar"]
        buttons[i] = "bottom_bar active"
        this.setState({
            buttons: buttons,
            page: page,
            component_name: component_name
        })
    }

    render() {

        return (

            <div className="main_user_page_container">

                {this.state.page}


                <footer id="footer_bar">
                    <div className="description" onClick={() => { this.change_tab("NotificationBlock") }}>
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
                    <input type="hidden" id="reset_frame" name="reset_frame" value="" />
                </footer>
            </div>

        )

    }
}

export class TitleComponent extends Component {
    render() {
        let temp = Date.now()
        let now = new Date(temp)
        let date = now.getDate()
        let months = now.getMonth() + 1
        let year = now.getFullYear()

        let date_str = date + "." + months + "." + year
        return <div className="page_title">{Dictionary[this.props.title_name] + " | " + date_str}</div>;
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
                <LangBtn />
                <img alt="Majordomo logo" id="majordomoLogo" src={logo} onClick={() => { window.location = '/'; }}></img>
                <button id="logoutBtn" onClick={() => {
                    auth.signOut()
                    window.location.reload()
                }} >{Dictionary.signOut}</button>
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
        this.btn_handler(0)
    }

    btn_handler(i) {
        //switches the button collor and initiates the props callback
        var red_style = { background: "#FD4141", color: "#FFFFFF", border: "0px" },
            defult_style = { background: "none", color: "#707070", border: "1px solid #707070" }
        var btn_styles = [defult_style, defult_style, defult_style]
        btn_styles[i] = red_style
        this.setState({btn_styles});
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
        return (<div className="toolbar_buttons" style={{ width: width + "%" }}>
            {btns}
        </div>);
    }
}