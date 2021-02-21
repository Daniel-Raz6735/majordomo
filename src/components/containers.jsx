import React, { Component } from 'react';
import { Dictionary } from '../Dictionary';
import "./containers.css"
import {base_url} from '../index'
import $ from 'jquery'
import { AddToOrder } from '../pages/inventory_page';


export var fake_containers={
    "Vegetables":{
        0:{"date":'2017-10-20 07:00:03', "item_id": 1, "item_name": "Pottato", "weight":"24", "symbol":null, "category_name":"Vegetables", "category_id":1 },
        1:{"date":'2017-10-20 08:00:03', "item_id": 2, "item_name": "Pepper", "weight":"2", "symbol":null, "category_name":"Vegetables", "category_id":1 },
        2:{"date":'2017-10-20 09:00:03', "item_id": 3, "item_name": "Zucchini", "weight":"3", "symbol":null, "category_name":"Vegetables", "category_id":1 },

    },
    "fruit":{
        3:{"date":'2017-10-21 10:00:03', "item_id": 4, "item_name": "Orange", "weight":"5", "symbol":null, "category_name":"fruit", "category_id":2 },
        2:{"date":'2017-10-22 11:00:03', "item_id": 5, "item_name": "Pineapple", "weight":"20", "symbol":null, "category_name":"fruit", "category_id":2 },
    }
}

export function req_weights(callback, user_id ,item_id=null){
    //request a container  for somone or all of the containers for a user
    var request = base_url+'/get/current_weights';

    if (user_id){
        request += "?business_id="+user_id
        if(item_id)
            request += "&item_id=" + item_id
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


export function render_container(weights_dict){
    //gets a list of weights and puts and renders the maximal  
    var res = [];
    if (weights_dict){
        Object.keys(weights_dict).forEach(key => {
            res.push(<ItemBlock name={weights_dict[key]["item_name"]} weight ={weights_dict[key]["total_weight"]} weight_date = {weights_dict[key]["date"]} />)
        });
    }
    return res;
};



export class Containers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weights_dict: props.weights_dict,
            page:[]
            
        }
    }

  
    
    render() {
        return (
            <div>
            {render_container(this.state.weights_dict)}
            </div>
        )
    }
}

export class ItemBlock extends Component {
    /* creates a squere containing an item object
    input props:weight = the weight of the item
                date weighd:
    */
    constructor(props) {
        super(props);
        var date =  getDate(props.weight_date);

        this.state = {
            name: props.name,
            weight: props.weight,
            unit: props.unit?props.unit:"kg",
            weight_date: date,
            color: props.color,
            symbol: props.symbol
                 
        }
    }
    render() {

        return (
            <div className="item_container">
            <div className = "item_squere">
                <div>
                    {this.state.name}
                </div>
               <div >{this.state.weight} {this.state.unit}</div>
               <div>{this.state.weight_date} </div>
                </div>
            {/* <div className="add_to_order">{Dictionary.add_to_order}</div> */}
            <AddToOrder kind ={1} />
            </div>
        )
    }
}

function getDate(elementDate){

    if(!elementDate)
        return Dictionary["unknown_date"]
    var temp =  Date.now()
    var now = new Date(temp)
    var dataTime = new Date(elementDate)
    var str

            if((now.getMonth()+1 === dataTime.getMonth()+1) && (now.getDate() === dataTime.getDate()))
            {
                let hour = dataTime.getHours()
                let minutes = dataTime.getMinutes()
                let Seconds = dataTime.getSeconds()

                str = hour +":"+minutes+":"+Seconds
            }
            else
                str = dataTime.getDate() + "/" +  (dataTime.getMonth()+1) +"/" + dataTime.getFullYear()
        
            return str.toString()
}


