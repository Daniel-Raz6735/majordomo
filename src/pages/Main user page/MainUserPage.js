import React, { Component } from 'react';
import { Dictionary, LangBtn } from '../../Dictionary'
import { auth } from '../../config/firebaseConfig'
import './MainUserPage.css'
import $, { data } from 'jquery';
import {BottomBar, Container, Item_block, Notification} from "../../components/containers"
import ReactDOM from 'react-dom';
import f from '../../images/icons/USA.svg'
import cart_plus from '../../images/icons/cart_plus.svg'
import logo from '../../images/icons/Majordomo logo.svg'



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
    var res = [];
    var max = -Number.MAX_SAFE_INTEGER;
    if (data){
        data.forEach(element => {
            res.push(<Item_block name={element[3]} weight ={element[1]} weight_date = {element[2]} />)
        });
    }
    // res = <Item_block name="Agvania" weight ={max} weight_date = "20.1.12" />
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
                
                <div className="notification_block">
                <Notification status="red" action={cart_plus} number={0} alert_image={f} />
                <Notification status="green" action={cart_plus} number={2} alert_image={f} />
                <Notification status="yellow" action={cart_plus} number={1} alert_image={f} />
                </div>

                <div id ="data_insert"></div>
                </div>
                <BottomBar />
       
            </div>
          
        );

    }
}
export default MainUserPage

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