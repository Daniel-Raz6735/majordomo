import x_icon from '../../images/x_icon.svg'
import { Component } from "react";
import { Modal, ButtonToolbar } from "rsuite";
import  "./modal.css";
import ModalBody from 'rsuite/lib/Modal/ModalBody';

export class ModalTemplate extends Component {
  /*exepts props: 
  modalContent, modalSize, btnContent , modal_head
  */


  constructor(props) {
    super(props);
    this.state = {


    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

  }

  open() {
    this.setState({ show: true });
  }
  close() {
    this.setState({ show: false });
  }

  render() {
    var btnContent = this.props.btnContent ? this.props.btnContent : "Open modal",
      size = this.props.modalSize ? this.props.modalSize : 'xs',
      modal_head = this.props.modal_head? this.props.modal_head: this.props.btnContent
    return (
      <div className="modal_container">
        <ButtonToolbar><div className="open_modal" onClick={this.open}>{btnContent}</div> </ButtonToolbar>
        <Modal dialogClassName="modal_template" size={size} show={this.state.show} onHide={this.close}>
          <div className="modal_template_header">
          <img src={x_icon} alt="X" className="model_x" onClick={this.close} />
          <div className="center_text">{modal_head}</div>
          </div>
          <div className="model_template_content">
            {this.props.modalContent}
          </div>
        </Modal>
      </div>

    );
  }
}

