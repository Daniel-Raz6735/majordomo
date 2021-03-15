import "./bars.css"
import inventory from '../images/icons/inventory.svg'
import home from '../images/icons/home.svg'
import cart from '../images/icons/cart.svg'
import profile from '../images/profile.svg'
import React, { Component } from 'react';
import { auth } from '../config/firebaseConfig'
import { Dictionary, getRTL, getTime, LangBtn } from '../Dictionary';
import logo from '../images/icons/Majordomo logo.svg';
import InventoryPage from "../pages/inventory_page"
import OrdersPage from "../pages/orders_page"
import { Loader } from 'rsuite';
import { create_initial_data_dict, confirm_papulation } from './data_dictionary';
import SettingPage from "../pages/settings_page"
import fake_data from '../fake_data.json'
import { base_url } from '../index'
import $ from 'jquery'
import HomePage from "../pages/home page/home_page"
var socket_client = require('websocket').w3cwebsocket;


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
        this.get_initial_data = this.get_initial_data.bind(this);

    }
    componentDidMount() {
        var ws = new socket_client('wss://majordomo.cloudns.asia/ws/1/1');
        // var ws = new socket_client('ws://127.0.0.1:8000/ws/1/1');
        // var wss = new socket_client('wss://majordomo.cloudns.asia/wss');


        // wss.onopen = function () { console.log('wss open'); };
        ws.onopen = function () { console.log('ws open'); };
        ws.onmessage = (message) => {
            // const dataFromServer = JSON.parse(message.data);
            console.log('got reply! ' + message.data);
            // this.change_tab(this.state.tab_name);
            window.location.reload()
        }
        console.log(ws)
        this.setState({ socket: ws });

        this.get_initial_data(this.process_initial_data, 1, this.state.tab_name)

        //establishing a way for chield components to switch tabs across the app
        $("#reset_frame").change(() => { console.log(this.change_tab($("#reset_frame").val())) })


    }
    send_msg() {
        this.state.socket.send(JSON.stringify({
            type: "message",
            msg: 1
        }));

    }
    process_initial_data(data, success, tab_name) {
        if (success) {
            // download(JSON.stringify(data) , 'file.json', 'text/plain');
            if (typeof (data) == "object") {
                var dict = create_initial_data_dict(data);
                console.log(dict)
                if (!dict)
                    this.setState({ page: <div> we encounterd a problem in loading data</div> })

                else {
                    confirm_papulation(dict, "process_initial_data", "initial data not recived well")
                    this.change_tab(tab_name, dict)
                    this.setState({ dict })
                }
            }
            else {
                console.log("intial data returnd with bad body")
            }
        }
        else
            this.setState({ page: <div> we encounterd a problem in loading data</div> })
    }

    get_initial_data(callback, business_id, tab_name) {
        //request all information for a business
        var request = base_url + '/get/current_view';

        if (business_id) {
            request += "?business_id=" + business_id + "&active=true"
            console.log(request)
            $.ajax({
                url: request,
                success: function (res) {
                    callback(res, true, tab_name);
                    console.log(res)
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
    change_tab(tab_name, dict) {
        //changes the tab on this component by name
        var page = [], i = 0
        if (!dict)
            dict = this.state.dict
        switch (tab_name) {
            case "SettingPage":
                i = 3;
                page = <SettingPage dict={dict} />
                break;

            case "OrdersPage":
            
                i = 2;
                page = <OrdersPage dict={dict} />
                break;

            case "InventoryPage":
           
                i = 1;
                page = <InventoryPage dict={dict} />
                break;

            case "HomePage": 
            default:
                i = 0;
                page = <HomePage dict={dict} />
                break;
        }
        var buttons = ["bottom_bar", "bottom_bar", "bottom_bar", "bottom_bar"]
        buttons[i] = "bottom_bar active"
        this.setState({
            buttons: buttons,
            page: page,
            tab_name: tab_name
        })
    }

    render() {

        return (

            <div className="main_user_page_container" dir={getRTL()}>
                <div className="site_data_cover">
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
                    <input type="hidden" id="reset_frame" name="reset_frame" value="" />
                </footer>
            </div>

        )

    }
}

export class TitleComponent extends Component {
    render() {
        return <div className="page_title">{Dictionary[this.props.title_name] + " | " + getTime()}</div>;
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
                <img alt="Majordomo logo" className="majordomoLogo" src={logo} onClick={() => { window.location = '/'; }}></img>
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
        var def_btn = this.props.def_btn?this.props.def_btn:0
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
        return (<div className="toolbar_buttons" style={{ width: width + "%" }}>
            {btns}
        </div>);
    }
}