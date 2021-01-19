import React, { Component } from 'react';
import { Dictionary, LangBtn } from '../../Dictionary'
import { auth } from '../../config/firebaseConfig'
import './MainUserPage.css'
import $, { data } from 'jquery';
import {Notification_block} from "../../components/notifications"
import {Item_block, Container} from "../../components/containers"
import {BottomBar, Nav_bar} from "../../components/bars"
import ReactDOM from 'react-dom';

import cart_plus from '../../images/icons/cart_plus.svg'
import logo from '../../images/icons/Majordomo logo.svg'
import {base_url} from '../../index'



// function render_container(data){
//     ReactDOM.render(<Container all_weights ={data}/>, document.getElementById('data_insert'));
// }
// weighing_date
// container_id
// weight_value
// last_user
function render_container(data){
    //gets a list of weights and puts and renders the maximal  
    var res = [];
    var max = -Number.MAX_SAFE_INTEGER;
    if (data){
        data.forEach(element => {
            console.log(element)
            res.push(<Item_block name={element["item_name"]} weight ={element["weight"]} weight_date = {element["date"]} />)
        });
    }
    res.push(<Item_block id="replace_cont" name="Avocado" weight ={1.2} weight_date = {"Mon, 20 Oct 2014 07:00:03 GMT"} />)
    
    ReactDOM.render(res, document.getElementById('data_insert'));
}




function req_container(callback, user_id ,container_number){
    //request a container  for somone or all of the containers for a user
    var request = base_url+'/get/containers';

    if (user_id){
        request += "?client_id="+user_id
        if(container_number)
            request += "&container_id=" + container_number
    console.log(request)
    $.ajax({
        url: request, 
        success: function (res) {
            callback(res);
        },
        error: function (err) {
            // alert(err);
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
        this.state = {
            page: [],

        }

    }


    componentDidMount(){
     
       req_container(render_container,1)

    }

    render() {

        return (
            <div id="main_user_page_container">
               
                <Nav_bar/>
                <div className="main_info_container" >
                <Notification_block/>
                <div id ="data_insert"></div>
                </div>
                <BottomBar />
       
            </div>
          
        );

    }
}
export default MainUserPage

