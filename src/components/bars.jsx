import "./bars.css"
import inventory from '../images/icons/inventory.svg'
import home from '../images/icons/home.svg'
import cart from '../images/icons/cart.svg'
import profile from '../images/icons/profile.svg'
import {base_url} from '../index'
import React, { Component } from 'react';
import { auth } from '../config/firebaseConfig'
import { Dictionary , LangBtn} from '../Dictionary';
import logo from '../images/icons/Majordomo logo.svg';
import { Link } from "react-router-dom"
import ReactDOM from 'react-dom'
import MainUserPage from "../pages/Main user page/MainUserPage"
import InventoryPage from "../pages/inventory_page"
import Settings_page from "../pages/settings_page"
import Orders_page from "../pages/orders_page"
import { Notification_block } from "./notifications"

export class BottomBar extends Component{
    
    constructor(props) {
        super(props);
        
        this.state = {
            buttons:["bottom_bar active","bottom_bar","bottom_bar","bottom_bar"],
            page:<MainUserPage/>
            
        }
        this.handleChange = this.handleChange.bind(this);
       
    }

    handleChange(i,page){
        var buttons =  ["bottom_bar","bottom_bar","bottom_bar","bottom_bar"]
        buttons[i] ="bottom_bar active"
        this.setState({buttons:buttons,
                       page:page
        })
    }

    render(){

    return(

        <div className="main_user_page_container">
           
            {this.state.page}


        <footer id = "footer_bar">
            <div className="description" onClick={()=> this.handleChange(0,<Notification_block/>)}>
                <img  className="bottom-bar-btn" src={home} />
                <div className={this.state.buttons[0]}><div className="tester">{Dictionary["home"]}</div></div>
            </div>

            <div className="description" onClick={()=> this.handleChange(1,<InventoryPage/>)}>
                <img className="bottom-bar-btn" src={inventory} />
                <div className={this.state.buttons[1]}>
                    <div  className="tester">{Dictionary["inventory"]}</div>
                </div>
            </div>

            <div className="description" onClick={()=> this.handleChange(2,<Orders_page/>)}>
                <img className="bottom-bar-btn" src={cart}/>
                <div className={this.state.buttons[2]}>
                    <div  className="tester">{Dictionary["orders"]}</div>
                </div>
            </div>
        
            <div className="description" onClick={()=> this.handleChange(3,<Settings_page/>)}>
                 <img className="bottom-bar-btn" src={profile}/>
                 <div className={this.state.buttons[3]} >
                     <div  className="tester">{Dictionary["profile"]}</div>
                 </div>
            </div>
        </footer>
        </div>

    )

    }
}

export class Nav_bar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }


    componentDidMount(){

    }

    render() {

        return (
            <header className="header"> 
                <LangBtn />
                <img alt="Majordomo logo" id="majordomoLogo" src ={logo} onClick={() => {window.location = '/';}}></img>
                <button id="logoutBtn" onClick={() => {
                    auth.signOut()
                    window.location.reload()
                }} >{Dictionary.signOut}</button>
                </header>
        );

    }
}