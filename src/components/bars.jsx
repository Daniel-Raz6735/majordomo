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



export class BottomBar extends Component{
    
    constructor(props) {
        super(props);
        this.state = {
            home_btn:"bottom_bar active",
            inventory_btn:"bottom_bar",
            orders_btn:"bottom_bar",
            profile_btn:"bottom_bar"
        }

    }

    handleChange(e){
        this.setState({"inventory_btn":"bottom_bar","orders_btn":"bottom_bar","profile_btn":"bottom_bar","home_btn":"bottom_bar"})
        this.setState({e:"bottom_bar active"})
    }

    render(){

    return(
        <footer id = "footer_bar">
            <Link className="description" to="/homePage">
                <img onClick={()=> this.handleChange("home_btn")} className="bottom-bar-btn" src={home} />
                <div className={this.state.home_btn}><div className="tester">{Dictionary["home"]}</div></div>
            </Link> 
            <Link className="description" to="/inventory">
                <img onClick={()=> this.handleChange("inventory_btn")} className="bottom-bar-btn" src={inventory} />
                <div className={this.state.inventory_btn}><div  className="tester">{Dictionary["inventory"]}</div></div>
            </Link> 
            <Link className="description" to="/inventory">
                <img onClick={()=> this.handleChange("orders_btn")} className="bottom-bar-btn" src={cart}/>
                <div className={this.state.orders_btn} ><div  className="tester">{Dictionary["orders"]}</div></div>
            </Link>
            <Link className="description" to="/inventory">
                 <img onClick={()=> this.handleChange("profile_btn")} className="bottom-bar-btn" src={profile}/>
                 <div className={this.state.profile_btn} ><div  className="tester">{Dictionary["profile"]}</div></div>
            </Link>
        </footer>

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