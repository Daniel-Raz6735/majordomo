import React, { Component } from "react";
import { Badge, ButtonToolbar, Modal, Notification as note } from "rsuite";
import { NotificationList } from "../components/notifications";
import { Dictionary, getRTL } from "../Dictionary";
import { TitleComponent } from "../components/bars";
import './inventory_page.css'
import cart_plus from '../images/icons/orders/cart_plus.svg'
import x_icon from '../images/x_icon.svg'
import $ from 'jquery'
import { base_url } from "..";
import { getUnitById } from "../components/data_dictionary";





class InventoryPage extends Component {
  // constructor(props) {
  //     super(props);

  // }


  render() {
    return (
      <div className="inventory_page_container">
        <TitleComponent title_name="inventory" />
        <NotificationList key={"not_list"} dict={this.props.dict} />
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
      title: props.title,
      is_in_order: props.is_in_order,
      // defult_val: props.defult_val ? props.defult_val : 10,
      incraments: props.incraments ? props.incraments : 1,
      quantity: props.defult_val ? props.defult_val : 10,
      div_content: "",
      btn_color: "#73D504",
      btn: <img src={cart_plus} alt={Dictionary["add_to_order"]} onClick={() => this.open('xs')} style={{ "cursor": "pointer" }} />,
      button_text: (this.props.is_in_order) ? Dictionary["edit_order"] : Dictionary["add_to_order"],
      min: 1,
      max: 99,
      unit: props.unit
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.addOrder = this.addOrder.bind(this);
    this.handleMinus = this.handleMinus.bind(this);
    this.handlePlus = this.handlePlus.bind(this);
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

  handleMinus() {
    var new_val = this.state.quantity - this.state.incraments;
    
    if (new_val >= this.state.min)
      this.setState({ quantity: new_val });
    else
      alert("enterd to little")
  }

  handlePlus() {
    var new_val = this.state.quantity + this.state.incraments;
    
    if (new_val <= this.state.max)
      this.setState({ quantity: new_val });
    else
      alert("enterd to much")
  }

  // getQuantity(value) {
  //   this.setState({value:value})
 
  // }

  addOrder(value) {
    var unit = this.state.unit,
      title = this.state.title
    

    // order details dictionary
    let dict = {
      business_id: this.props.business_id,
      item_id: parseInt(this.props.item_id),
      order_id: this.props.order_dict ? parseInt(this.props.order_dict["order_id"]) : 0,
      supplier_id: this.props.supplier_id,
      amount: value,
      unit: unit
    }
    

    let request = base_url + "/order/add/item"

    let response

    // 
    $.ajax({
      url: request,
      type: "POST",
      data: JSON.stringify(dict),
      contantType: "application/json",
      // processData: true,
      // enCode: true,
      success: function (res) {
        response = res
       
        scree_alert('success', dict["amount"], getUnitById(unit), title);
        
      },
      error: function (err) {
        response = err
        scree_alert('error', dict["amount"], getUnitById(unit), title);
        

      }


    }).then(() => {

      // here we can edit badge for items in order
      if (this.state.kind === 0 && response && response[1] === 200) {

        let div_content

        div_content = <Badge content={value} >{this.state.btn}</Badge>

        div_content = <div className="cart_container">
          <div className="cart_photo_container">{div_content}</div>
          <div className="cart_text_container">{this.state.button_text}</div>
        </div>

        this.setState({
          div_content: div_content,
          quantity: value
        })
      }
    });




  }

  componentDidMount() {
   

    // var button_text = (this.state.is_in_order) ? Dictionary["edit_order"] : Dictionary["add_to_order"]
    // btn = <img src={cart_plus} alt={Dictionary["add_to_order"]} onClick={() => this.open('xs')} style={{ "cursor": "pointer" }} />
    let div_content = ""

    // add to order button.
    if (this.state.kind === 0) {

      // item is allready in order
      if (this.state.is_in_order)
        div_content = <Badge content={this.state.quantity}>{this.state.btn}</Badge>

      else
        div_content = this.state.btn

      div_content = <div className="cart_container">
        <div className="cart_photo_container">{div_content}</div>
        <div className="cart_text_container">{this.state.button_text}</div>
      </div>


    }
    // add to order from category drawer.
    else if (this.state.kind === 1)
      div_content = Dictionary.add_to_order

    this.setState({ div_content })
  }


  render() {


    return (
      <div className="add_to_cart_modal_container">
        <ButtonToolbar><div className="add_to_order" onClick={() => this.open('xs')} >{this.state.div_content}</div> </ButtonToolbar>
        <Modal dialogClassName="add_to_order_modal" size={'xs'} show={this.state.show} onHide={this.close}>


          <img src={x_icon} alt="X" className="model_x_xs" onClick={this.close} />
          <div className="model_content_xs">

            <div className="model_title_xs">
              {this.state.title}
            </div>
            <div className="model_item_name clamp_line">
              {this.state.title}
            </div>
            <Quantity value={this.state.quantity} handleMinus={this.handleMinus} handlePlus={this.handlePlus} defaultValue={this.state.quantity} unit={this.state.unit} />

            <button className="add_to_order_btn" onClick={() => { this.addOrder(this.state.quantity); this.close() }} style={{ backgroundColor: this.state.btn_color }} >
              {Dictionary["add_to_order"]}
            </button>
            <div className="model_footer_xs" onClick={() => { $("#reset_frame").val("OrdersPage").change() }}>{Dictionary["go_to_orders"]}</div>

          </div>
        </Modal>
      </div>
    );
  }
}

// This function get  if add to order request success or failed and notify the user the condition of the request.
function scree_alert(funcName, amount, unit, item_name) {
  note[funcName]({
    title: funcName === 'success' ? Dictionary["item_added"] : Dictionary["item_added_failed"],
    description: <div >{amount} {unit} {item_name} </div>
  });
}

export class Quantity extends Component {
  constructor(props) {
    super(props);
    this.state = {


    };

  }

  render() {
    return (
      <div className="quantity_container">
        <div className="quantity_select minus_symbol" onClick={this.props.handleMinus} >-</div>
        <input type="text" className="quantity_window" name="quantity window" style={{ cursor: "default" }} defaultValue={this.props.defaultValue} dir={getRTL()} value={this.props.value + " " + Dictionary[getUnitById(this.props.unit)]} disabled />
        <div className="quantity_select plus_symbol" onClick={this.props.handlePlus}>+</div>
      </div>)
  }
}