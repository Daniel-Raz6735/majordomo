import React, { Component } from 'react';
import { Dictionary } from '../Dictionary';
import "./containers.css"
import inventory from '../images/inventory.svg'
import home from '../images/home.svg'
import cart from '../images/cart.svg'
import profile from '../images/profile.svg'

export const BottomBar = (props) =>{

    return(
        <footer>
        <div id = "bottom-bar">
            
            <img className="bottom-bar-btn" src={home} onClick={()=> alert("yess")}></img>
            <img className="bottom-bar-btn" src={inventory}></img>
            <img className="bottom-bar-btn" src={cart}></img>
            <img className="bottom-bar-btn" src={profile}></img>

        </div>
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