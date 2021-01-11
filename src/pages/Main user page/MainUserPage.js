import React, { Component } from 'react';
import { Dictionary, LangBtn } from '../../Dictionary'
import { auth } from '../../config/firebaseConfig'
import './MainUserPage.css'
import axios from 'axios'
import $, { data } from 'jquery';
import {Container, Item_block} from "../../components/containers"
import ReactDOM from 'react-dom';

const base_url = "http://127.0.0.1:5000"



// function render_container(data){
//     ReactDOM.render(<Container all_weights ={data}/>, document.getElementById('data_insert'));
// }
// weighing_date
// container_id
// weight_value
// last_user
function render_container(data){
    //gets a list of weights and puts and renders the maximal  
    var res = "";
    var max = -Number.MAX_SAFE_INTEGER;
    if (data){
        data.forEach(element => {
            if(element.length==4)
                if(element[3]> max)
                    max = element[3]
        });
    }
    res = <Item_block name="Agvania" weight ={max} weight_date = "20.1.12" />
    ReactDOM.render(res, document.getElementById('data_insert'));
}


function req_container(callback, user_id ,container_number){
    //request a container  for somone or all of the containers for a user
    var request = base_url+'/get/containers';

    if (user_id){
        request += "?user_id="+user_id
        if(container_number)
            request += "&container_id=" + container_number
    
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
    else{
        console.log("no user id enterd. nothing happend")
    }
    
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

                {/* <button className ="test" onClick ={()=> req_container(func,1)}>1</button>
                <button className ="test" onClick ={()=> req_container(func,2) }>2</button>
                <button className ="test" onClick ={()=> req_container(func,3) }>3</button>
                <button className ="test" onClick ={()=> req_container(func) }>all</button> */}
                <div id ="data_insert"></div>
                <div>
                {req_container(render_container,1,"id")}
                <Item_block name="Tapuach" weight ={2} unit = "kg" weight_date = "20.1.12" />
                </div>
             
                
            </div>
        );

    }
}
export default MainUserPage