import React, { Component } from 'react';
import { Dictionary, LangBtn } from '../../Dictionary'
import { auth } from '../../config/firebaseConfig'
import './MainUserPage.css'
import axios from 'axios'
import $, { data } from 'jquery';
import {Container} from "../../components/containers"
import ReactDOM from 'react-dom';

const base_url = "http://127.0.0.1:5000"



function render_container(data){
    ReactDOM.render(<Container all_weights ={data}/>, document.getElementById('data_insert'));
}


function req_container(callback,id){
    
  
    var request = base_url+'/get/containers';
    if (id){
        request += "?"
        request += "container_id=" + id
    }

    $.ajax({
        url: request, 
        success: function (res) {
            callback(res);
        },
        error: function (err) {
            alert(err);
        }
    });

    
}


class MainUserPage extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        // window.location = "www.google.com"
        const func = render_container;
        return (
            <div>
                Hello World
                <table id="res_table">
                    <th></th>
                </table>
                <LangBtn />
                <button id="logoutBtn" onClick={() => {
                    auth.signOut()
                    window.location.reload()
                }} >{Dictionary.signOut}</button>

                <button className ="test" onClick ={()=> req_container(func,1)}>1</button>
                <button className ="test" onClick ={()=> req_container(func,2) }>2</button>
                <button className ="test" onClick ={()=> req_container(func,3) }>3</button>
                <button className ="test" onClick ={()=> req_container(func) }>all</button>
                <div id ="data_insert"></div>
                
            </div>
        );

    }
}
export default MainUserPage