import React, { Component } from 'react';
import { Dictionary } from '../Dictionary';
import "./containers.css"
import inventory from '../images/icons/inventory.svg'
import home from '../images/icons/home.svg'
import cart from '../images/icons/cart.svg'
import profile from '../images/icons/profile.svg'
import warning from '../images/icons/warning.svg'
import circle_warning from '../images/icons/circle red warning.svg'
import cart_plus from '../images/icons/cart_plus.svg'
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

    // handleChange(e) {
    //     this.setState({ [e.target.name]: e.target.value });
    // }
    // componentWillMount() {
       
    // }
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
            number:props.number,
            action:props.action
                 
        }
    }

    render(){

        return(
            <div className = "notification_container">
                <div className="center_items left_notification_area">
                <img id="left_img" src ={this.state.action} className="notification_image" alt="item action"></img>
                </div>

                <div className = "notification center_items">
                    {this.state.status}
                </div>

               <NotificationSymbol symbolNumber={this.state.number}/>                
            </div>
        )
    }



}

export const NotificationSymbol= (props) =>{

    var symbolArr = [warning,circle_warning,circle_warning],styleArr=["rgba(235, 104, 104, 0.32)","rgba(241, 192, 51, 0.32)","rgba(115, 213, 4, 0.32)"]
    var symbolNumber = props.symbolNumber, symbol = symbolArr[symbolNumber]
    
    var color = {"background-color": styleArr[symbolNumber]}
    
    return(
        <div className={ "notification_symbol center_items"} style={color}>
                <img  src ={symbol} className="notification_image right_img"></img>
        </div>
    )


    

}