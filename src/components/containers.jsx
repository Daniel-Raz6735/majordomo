import React, { Component } from 'react';
import { Dictionary } from '../Dictionary';
import "./containers.css"
import inventory from '../images/inventory.svg'
import home from '../images/home.svg'
import cart from '../images/cart.svg'
import profile from '../images/profile.svg'
import styles from "./containers.css"
import warning from '../images/warning.svg'
import circle_warning from '../images/circle_warning.svg'
import cart_plus from '../images/cart_plus.svg'

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
        this.state = {
            name: props.name,
            weight: props.weight,
            unit: props.unit?props.unit:"kg",
            weight_date: props.weight_date,
            color: props.color,
            symbol: props.symbol
                 
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    componentWillMount() {
       
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
            <div className="add_to_order">{Dictionary.add_to_order}</div>
            </div>
        )
    }
}

export class Notification extends Component{

    constructor(props) {
        super(props);
        this.state = {
            status:props.status,
            alert_image:props.alert_image,
            number:props.number,
            action:props.action
                 
        }
    }

    render(){

        return(
            <div className = "notification_container">

                <div className="center_items right_not_symbol">
                <img id="left_img" src ={this.state.action} className="notification_image"></img>
                </div>

                <div className = "notification center_items">
                    {this.state.status}
                </div>

                
               <NotificationAlert symbolNumber={0} color={1}  />
                
            </div>
        )
    }



}

export const NotificationAlert = (props) =>{

    var symbolArr = [warning,circle_warning,cart_plus],styleArr=[styles.redArea,styles.yellowArea,styles.greenArea]
    var color = props.color,symbol = symbolArr[props.symbolNumber]
    
    
    return(
        <div className={ "redArea notification_symbol center_items"} >
                <img  src ={symbol} className="notification_image right_img"></img>
        </div>
    )


    

}