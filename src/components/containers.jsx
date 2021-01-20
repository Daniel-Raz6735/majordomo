import React, { Component } from 'react';
import { Dictionary } from '../Dictionary';
import "./containers.css"
import {base_url} from '../index'



export class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_weights: props.all_weights,
            page:[]
            
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    componentWillMount() {
        var all_weights = this.state.all_weights
        if(all_weights){
            var page = []
            console.log(all_weights)
            all_weights.forEach(weight => {
                var row = []
                weight.forEach(element => {
                     row.push(<td>{element}</td>)
                });
                page.push(<tr>{row}</tr>)
            });
            this.setState({page:page})
        }
    }
    render() {

        return (
            <table><tr><th>container id</th><th>time eddad</th><th>item id</th><th>client id</th></tr>
            {this.state.page}
            </table>
        )
    }
}

export class Item_block extends Component {
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
            <div id={this.props.id} className="item_container">
            <div className = "item_squere">
                <div>
                    {this.state.name}
                </div>
               <div >{this.state.weight} {this.state.unit}</div>
               <div>{this.state.weight_date} </div>
                </div>
            <div className="add_to_order">{Dictionary.add_to_order}</div>
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

            if((now.getMonth()+1 == dataTime.getMonth()+1) && (now.getDate() == dataTime.getDate()))
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


