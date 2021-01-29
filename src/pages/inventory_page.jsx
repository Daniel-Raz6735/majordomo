// import { Button, Modal } from "antd";
import React, { Component} from "react";
import { ButtonToolbar,Button, Modal, InputGroup, InputNumber } from "rsuite";
import { BottomBar, Nav_bar } from "../components/bars";
import {get_notifications,process_notifications} from "../components/notifications";
import { Dictionary } from "../Dictionary";
import './inventory_page.css'
import cart_plus from '../images/icons/cart_plus.svg'




class InventoryPage extends Component{
    constructor(props) {
        super(props);

    }


    render() {
        var temp =  Date.now()
        var now = new Date(temp)
        let date = now.getDate()
        let months = now.getMonth()+1
        let year = now.getFullYear()

               var str = date +"."+months+"."+year

               get_notifications(process_notifications,1)//fuction currently under constroction
        
        return (
            <div id="inventory_page_container">
                    <div className="page_title">{Dictionary["inventory"] + " | "+str}</div>
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
        show: false
      };
      this.close = this.close.bind(this);
      this.open = this.open.bind(this);
    }
    close() {
      this.setState({
        show: false
      });
    }
    open(size) {
      this.setState({
        size,
        show: true
      });
    }
    render() {
      return (
        <div className="add_to_cart_modal_container">
          <ButtonToolbar>
            {/* <Button size="xs" onClick={() => this.open('xs')}>
              Xsmall
            </Button> */}
            <img src={cart_plus} onClick={() => this.open('xs')} style={{"cursor":"pointer"}} />
          </ButtonToolbar>
          <Modal  size={this.state.size} show={this.state.show} onHide={this.close}>
            <Modal.Header>
              <Modal.Title>Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Quantity />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close} appearance="primary">
                {Dictionary["add_to_order"]}
              </Button>
              
            </Modal.Footer>
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
       <div style={{width: 160}}>
       
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


