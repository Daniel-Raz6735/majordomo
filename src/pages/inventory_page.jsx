import React, { Component } from "react";
import { Badge, ButtonToolbar, Modal } from "rsuite";
import {  NotificationBlock } from "../components/notifications";
import { Dictionary } from "../Dictionary";
import { TitleComponent } from "../components/bars";
import './inventory_page.css'
import cart_plus from '../images/icons/cart_plus.svg'
import x_icon from '../images/x_icon.svg'
import $ from 'jquery'





class InventoryPage extends Component {
  // constructor(props) {
  //     super(props);

  // }


  render() {
    let temp = Date.now()
    let now = new Date(temp)
    let date = now.getDate()
    let months = now.getMonth() + 1
    let year = now.getFullYear()

    let str = date + "." + months + "." + year

    return (
      <div id="inventory_page_container">
        <TitleComponent title_name="inventory" />
        <NotificationBlock  />

      </div>

    );

  }
}
export default InventoryPage



export class AddToOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      kind: props.kind,
      title: props.title
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }
  close() {
    this.setState({ show: false });
  }
  open(size) {
    this.setState({
      size,
      show: true
    });
  }
  render() {
    var type = "",
      btn_color = "#73D504"
    if (this.state.kind === 0)
      type =<Badge content={77}> <img src={cart_plus} alt={Dictionary["add_to_order"]} onClick={() => this.open('xs')} style={{ "cursor": "pointer" }} /></Badge>
    else if (this.state.kind === 1)
      type = <div className="add_to_order" onClick={() => this.open('xs')} >{Dictionary.add_to_order}</div>

    return (
      <div className="add_to_cart_modal_container">
        <ButtonToolbar>{type}</ButtonToolbar>
        <Modal size={this.state.size} show={this.state.show} onHide={this.close}>

          <img src={x_icon} alt="X" className="model_x_xs" onClick={this.close} />
          <div className="model_content_xs">

            <div className="model_title_xs">
              {this.state.title}
            </div>
            <div className="model_item_name clamp_line">
              {this.state.title}
            </div>
            <Quantity />

            <button className="add_to_order_btn" onClick={this.close} style={{ backgroundColor: btn_color }} >
              {Dictionary["add_to_order"]}
            </button>
            <div className="model_footer_xs" onClick={()=>{$("#reset_frame").val("OrdersPage").change()}}>{Dictionary["go_to_orders"]}</div>

          </div>
        </Modal>
      </div>
    );
  }
}


export class Quantity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: props.defaultValue?props.defaultValue:10,
      incraments: props.incraments?props.incraments:1,
      unit: props.unit?props.unit:Dictionary["kg"],
      min:1,
      max:99,
    };
    this.handleMinus = this.handleMinus.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
  }
  handleMinus() {
    var new_val =this.state.quantity - this.state.incraments;
    if(new_val >= this.state.min)
      this.setState({ quantity: new_val });
    else
      alert("enterd to little")
  }
  handlePlus() {
    var new_val =this.state.quantity + this.state.incraments;
    if(new_val <= this.state.max)
      this.setState({ quantity: new_val });
    else
      alert("enterd to much")
  }

  render() {
    return(
    <div className="quantity_container">
      <div  className="quantity_select minus_symbol" onClick={this.handleMinus} >-</div>
    
      <input type="text" className="quantity_window" name="quantity window" value={this.state.quantity + " "+ this.state.unit} disabled/>
     
      <div className="quantity_select plus_symbol" onClick={this.handlePlus}>+</div>
      </div>)
      }
}