import React, { Component } from 'react';
import { Dictionary, LangBtn } from '../../Dictionary'
import { auth } from '../../config/firebaseConfig'
import './MainUserPage.css'
import axios from 'axios'


function req(){
    alert("sssss")
    axios.get('http://127.0.0.1:5000/get/weights').then(response =>{
        alert(response)
    }).catch(error =>{
        alert(error)
    })
    
}


class MainUserPage extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        // window.location = "www.google.com"
        return (
            <div>
                Hello World
                <LangBtn />
                <button id="logoutBtn" onClick={() => {
                    auth.signOut()
                    window.location.reload()
                }} >{Dictionary.signOut}</button>
                <button class ="test" onClick ={()=> req()}>1</button>
                <button class ="test" onClick ={()=> window.location.replace("http://www.google.com") }>2</button>
                <button class ="test" onClick ={()=> window.location.replace("http://www.google.com") }>3</button>
            </div>
        );

    }
}
export default MainUserPage