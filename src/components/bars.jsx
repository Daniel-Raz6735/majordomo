import "./bars.css"
import inventory from '../images/icons/inventory.svg'
import home from '../images/icons/home.svg'
import cart from '../images/icons/cart.svg'
import profile from '../images/profile.svg'
import React, { Component } from 'react';
import { auth } from '../config/firebaseConfig'
import { Dictionary , LangBtn} from '../Dictionary';
import logo from '../images/icons/Majordomo logo.svg';
import InventoryPage from "../pages/inventory_page"
import OrdersPage from "../pages/orders_page"
import { NotificationBlock } from "./notifications"
import SettingPage from "../pages/settings_page"

export class SiteFrame extends Component{
    
    constructor(props) {
        super(props);
        
        this.state = {
            buttons:["bottom_bar active","bottom_bar","bottom_bar","bottom_bar"],
            page:<NotificationBlock/>
            
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
            <div className="description" onClick={()=> this.handleChange(0,<NotificationBlock/>)}>
                <img alt="Home" className="bottom-bar-btn" src={home} />
                <div className={this.state.buttons[0]}><div className="tester">{Dictionary["home"]}</div></div>
            </div>

            <div className="description" onClick={()=> this.handleChange(1,<InventoryPage/>)}>
                <img alt="Inventory" className="bottom-bar-btn" src={inventory} />
                <div className={this.state.buttons[1]}>
                    <div  className="tester">{Dictionary["inventory"]}</div>
                </div>
            </div>

            <div className="description" onClick={()=> this.handleChange(2,<OrdersPage/>)}>
                <img alt="Cart" className="bottom-bar-btn" src={cart}/>
                <div className={this.state.buttons[2]}>
                    <div  className="tester">{Dictionary["orders"]}</div>
                </div>
            </div>
        
            <div className="description" onClick={()=> this.handleChange(3,<SettingPage/>)}>
                 <img alt="Profile" className="bottom-bar-btn" src={profile}/>
                 <div className={this.state.buttons[3]} >
                     <div  className="tester">{Dictionary["profile"]}</div>
                 </div>
            </div>
        </footer>
        </div>

    )

    }
}

export class NavBar extends Component {

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