import "./bars.css"
import inventory from '../images/icons/inventory.svg'
import home from '../images/icons/home.svg'
import cart from '../images/icons/cart.svg'
import profile from '../images/icons/profile.svg'
import {base_url} from '../index'
import React, { Component } from 'react';
import { auth } from '../config/firebaseConfig'
import { Dictionary , LangBtn} from '../Dictionary';
import logo from '../images/icons/Majordomo logo.svg'



export const BottomBar = (props) =>{

    return(
        <footer id = "bottom-bar">
            <img className="bottom-bar-btn" src={home} onClick={()=> alert("yess")}></img>
            <img className="bottom-bar-btn" src={inventory}></img>
            <img className="bottom-bar-btn" src={cart}></img>
            <img className="bottom-bar-btn" src={profile}></img>
        </footer>

    )


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