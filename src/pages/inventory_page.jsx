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
        <NotificationList dict={this.props.dict} />
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
      defult_val: props.defult_val ? props.defult_val : 10,
      incraments: props.incraments ? props.incraments : 1,
      quantity: 10,
      min: 1,
      max: 99,
      unit: props.unit ? getUnitById(props.unit) : Dictionary["unknown"]
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
    console.log(new_val)
    if (new_val >= this.state.min)
      this.setState({ quantity: new_val });
    else
      alert("enterd to little")
  }

  handlePlus() {
    var new_val = this.state.quantity + this.state.incraments;
    console.log(new_val)
    if (new_val <= this.state.max)
      this.setState({ quantity: new_val });
    else
      alert("enterd to much")
  }

  // getQuantity(value) {
  //   this.setState({value:value})
  //   console.log(value)
  // }

  addOrder(value) {
    console.log(value)

    let dict = {
      item_id: parseInt(this.props.item_id), order_id: parseInt(this.props.order_id), business_id: this.props.business_id,
      supplier_id: this.props.supplier_id, amount: value, unit: this.state.unit
    }

    let request = base_url + "/order/add/item"

    $.ajax({
      url: request,
      type: "POST",
      data: JSON.stringify(dict),
      contantType: "application/json",
      // processData: true,
      // enCode: true,
      success: function (res) {
          
          console.log(res)
      },
      error: function (err) {
          
          console.log(err)
      }
  });

  }

  componentDidMount() {
    // console.log(this.props.order_dict)
  }


  render() {
    console.log(this.props.unit)
    var button_text = (this.state.is_in_order) ? Dictionary["edit_order"] : Dictionary["add_to_order"],
      btn_color = "#73D504",
      btn = <img src={cart_plus} alt={Dictionary["add_to_order"]} onClick={() => this.open('xs')} style={{ "cursor": "pointer" }} />,
      div_content = ""
    if (this.state.kind === 0) {
      if (this.state.is_in_order)
        div_content = <Badge content={this.state.defult_val}>{btn}</Badge>
      else
        div_content = btn
      div_content = <div className="cart_container">
        <div className="cart_photo_container">{div_content}</div>
        <div className="cart_text_container">{button_text}</div>
      </div>
    }
    else if (this.state.kind === 1)
      div_content = Dictionary.add_to_order

    return (
      <div className="add_to_cart_modal_container">
        <ButtonToolbar><div className="add_to_order" onClick={() => this.open('xs')} >{div_content}</div> </ButtonToolbar>
        <Modal size={this.state.size} show={this.state.show} onHide={this.close}>


          <img src={x_icon} alt="X" className="model_x_xs" onClick={this.close} />
          <div className="model_content_xs">

            <div className="model_title_xs">
              {this.state.title}
            </div>
            <div className="model_item_name clamp_line">
              {this.state.title}
            </div>
            <Quantity value={this.state.quantity} handleMinus={this.handleMinus} handlePlus={this.handlePlus} defult_val={this.state.defult_val} unit={this.state.unit} />

            <button className="add_to_order_btn" onClick={() => { open('success'); this.addOrder(this.state.quantity); this.close() }} style={{ backgroundColor: btn_color }} >
              {Dictionary["add_to_order"]}
            </button>
            <div className="model_footer_xs" onClick={() => { $("#reset_frame").val("OrdersPage").change() }}>{Dictionary["go_to_orders"]}</div>

          </div>
        </Modal>
      </div>
    );
  }
}

function open(funcName) {

  note[funcName]({
    title: "Item added successfully",
    description: <div >10 kg tomato</div>
  });
}

export class Quantity extends Component {
  constructor(props) {
    super(props);
    this.state = {


    };

  }


  render() {
    console.log(getUnitById (this.props.unit))
    return (
      <div className="quantity_container">
        <div className="quantity_select minus_symbol" onClick={this.props.handleMinus} >-</div>
        <input type="text" className="quantity_window" name="quantity window" style={{ cursor: "default" }} defaultValue={this.props.defaultValue} dir={getRTL()} value={this.props.value + " " +  Dictionary[getUnitById(this.props.unit)]} disabled />
        <div className="quantity_select plus_symbol" onClick={this.props.handlePlus}>+</div>
      </div>)
  }
}