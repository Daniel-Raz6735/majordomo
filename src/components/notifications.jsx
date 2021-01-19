import React, { Component } from 'react';
import "./notifications.css"
import yellow_warning from '../images/icons/triangle_warning.svg'
import circle_warning from '../images/icons/circle red warning.svg'
import cart_plus from '../images/icons/cart_plus.svg'
import suggest_dish from '../images/icons/suggest_dish.svg'
import overflow_sign from '../images/icons/overflow sign.svg'
import { Dictionary } from '../Dictionary';
import {base_url} from '../index'
import $ from 'jquery'
import ReactDOM from 'react-dom'



function get_notifications(callback, client_id){
    //request all notifications for a business
    var request = base_url+'/get/notifications';

    if (client_id){
        request += "?client_id="+client_id + "&active=true"
    console.log(request)
    $.ajax({
        url: request, 
        success: function (res) {
            callback(res);
        },
        error: function (err) {
            console.log(err)
        }
    });
    }
    else{
        console.log("no user id enterd. nothing happend")
    }
    
}

function process_notifications(data){
    var page = []
    
    var items = ["abc","cucumber","tomato"]
    if(typeof(data)=="object")

        data.forEach(element => {

            page.push(<Notification number={element["code"]%2} item_name={items[element["food_item_id"]]}  />)
        });
    ReactDOM.render( <div id ="first_notification" className="notification_block">{page}<div id ="insert_div"></div></div>,document.getElementById('first_notification'))
    
    sleep(5000).then(() => {
        ReactDOM.render( <Notification number={0}  item_name="Avocado" total_weight = {0.5} />,document.getElementById('insert_div')) 
        // Do something after the sleep!
      });  


}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  // Usage!
  




export class Notification_block extends Component{

    constructor(props) {
        super(props);
        this.state = {
            status:props.status,
            number:props.number,
            page: [],
            action:props.action
                 
        }
    }



    componentWillMount(){
        get_notifications(process_notifications,1)
    }
    render(){


        return(
            <div id ="first_notification" className="notification_block">
                <Notification number={0} item_name="red" total_weight={26} />
                <Notification  number={1} item_name="yellow" total_weight={26}/>
                <Notification number={2} item_name="orange" total_weight={26}/>
                </div>
        )
    }



}



export class Notification extends Component{

    constructor(props) {
        super(props);
        var arr = [cart_plus,suggest_dish] 
        var text_descp = [Dictionary["add_to_order"],Dictionary["suggest_dish"]] 
        var action_by_number = {
                                0:{"action":arr[0],"action_desc":text_descp[0],"message":Dictionary["just_few"]},
                                1:{"action":arr[0],"action_desc":text_descp[0],"message":Dictionary["running_low"]},
                                2:{"action":arr[1],"action_desc":text_descp[1],"message":Dictionary["must_use"]}
        };
        var mess = action_by_number[props.number].message,
        image = action_by_number[props.number].action,
        desc = action_by_number[props.number].action_desc
 
        this.state = {
            number:props.number,            
            item_name:props.item_name,
            total_weight: props.total_weight, 
            message:props.message?this.state.message:mess,
            action_image: image ,
            action_desc:desc,
        }
    }
    componentWillMount(){

        
    }

    render(){

        return(
            <div className = "notification_container">
                <div className="center_items left_notification_area">
                <img src ={this.state.action_image} className="notification_image left_img" alt={this.state.action_desc}/>
                {this.state.action_desc}
                </div>
                <div className="center_items notification_item_name">
                {this.state.item_name}
                </div>
                <div className="center_items notification_weight">
                <div>{this.state.total_weight}</div>
                </div>

                <div className = "notification center_items">
                    {this.state.message}
                </div>
               <NotificationSymbol symbolNumber={this.state.number}/>                
            </div>
        )
    }



}





export const NotificationSymbol= (props) =>{
    // notification symbol by code 
    // 0 is a red circle, 1 is yellow tringle, 2, is green overflow dish    
    var symbolArr = [circle_warning, yellow_warning, overflow_sign],
        styleArr=["rgba(235, 104, 104, 0.32)","rgba(247, 231, 185, 0.85)","rgba(255, 103, 14, 0.2)"]
    var symbolNumber = props.symbolNumber, symbol = symbolArr[symbolNumber],
        color = {"background-color": styleArr[symbolNumber]}
    
    return(
        <div className="notification_symbol_area center_items" style={color}>
                <img src ={symbol} className="notification_symbol"></img>
        </div>
    )


    

}