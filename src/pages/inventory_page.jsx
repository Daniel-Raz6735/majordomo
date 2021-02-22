// import { Button, Modal } from "antd";
import React, { Component } from "react";
import { ButtonToolbar, Modal, InputGroup, InputNumber } from "rsuite";
import { get_notifications, process_notifications } from "../components/notifications";
import { Dictionary } from "../Dictionary";
import './inventory_page.css'
import cart_plus from '../images/icons/cart_plus.svg'
import x_icon from '../images/x_icon.svg'





class InventoryPage extends Component {
  // constructor(props) {
  //     super(props);

  // }


  render() {
    var temp = Date.now()
    var now = new Date(temp)
    let date = now.getDate()
    let months = now.getMonth() + 1
    let year = now.getFullYear()

    var str = date + "." + months + "." + year

    get_notifications(process_notifications, 1)//fuction currently under constroction

    return (
      <div id="inventory_page_container">
        <div className="page_title">{Dictionary["inventory"] + " | " + str}</div>
        <div id="first_notification"></div>

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
      type = <img src={cart_plus} alt={Dictionary["add_to_order"]} onClick={() => this.open('xs')} style={{ "cursor": "pointer" }} />
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
            <div className="model_item_name">
              {this.state.title}
            </div>
            <Quantity />

            <button className="add_to_order_btn" onClick={this.close} style={{ backgroundColor: btn_color }} >
              {Dictionary["add_to_order"]}
            </button>
            <div className="model_footer_xs">{Dictionary["go_to_orders"]}</div>

          </div>
        </Modal>
      </div>
    );
  }
}


export const Quantity = () => {
  const inputRef = React.createRef();
  const handleMinus = () => {
    inputRef.current.handleMinus();
  };
  const handlePlus = () => {
    inputRef.current.handlePlus();
  };

  return (
    <div style={{ width: "100%" }}>

      <InputGroup>
        <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
        <InputNumber
          className={'custom-input-number'}
          ref={inputRef}
          max={99}
          min={1}
          defaultValue={10}
        />
        <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
      </InputGroup>
    </div>
  )
}


