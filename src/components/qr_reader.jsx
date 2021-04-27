import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import './qr_reader.css'
import { Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Modal } from 'rsuite'
import item_scan from '../images/icons/item_scan.svg'
import chain_icon from '../images/icons/chain_icon.svg'

export class Test extends Component {
    state = {
        stopStream: false

    }
    handleError = err => {
        console.error(err)
    }

    componentDidMount() {
        // if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        //     console.log("Let's get this party started")
        //     navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } }).catch(function (error) {
        //         console.log(error)
        //     }) 
        // }
    }
    render() {

        return (
            <div>
                <BarcodeScannerComponent
                    stopStream={this.state.stopStream}
                    onUpdate={(err, result) => {
                        console.log(err)
                        console.log(result)
                        if (result)
                            this.props.handleScan(result)
                        else
                            this.handleError(err);
                    }} />
            </div>
        )
    }
}

export class ModalDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            item_name: '',
            scaned: false,
            show: false
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleScan = this.handleScan.bind(this);
    }
    close() {
        this.setState({ show: false });
    }
    open() {
        this.setState({ show: true });
    }

    // scan QR and load it into container ID input
    handleScan = data => {

        if (data) {
            this.setState({
                id: data,
                scaned: true
            })
            console.log(data)
            console.log(this.state.id)
        }
    }

    handleChange(value) {
        console.log(value)
        this.setState({
            id: value["text"],
            item_name: value["item_name"]
        });
        //   console.log(value)
        console.log(this.state.id)
    }
    render() {

        let comp = this.state.scaned ? <button onClick={() => this.setState({ scaned: false })}>scan again</button> : <Test handleScan={this.handleScan} />

        return (
            <div >
                <Modal backdrop={"static"}  className="add_container_area" show={this.state.show} onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>New Container</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            fluid
                            onChange={this.handleChange}
                            formValue={this.state.formValue}
                        >
                            <div className="filters_area">
                                <ScanFilter  type={"Container ID"} />
                                <img src={chain_icon} alt="chain" />
                                <ScanFilter type={"Item"} />
                            </div>
                            <FormGroup>
                                {/* <Test handleScan={this.handleScan} /> */}
                                {comp}
                            </FormGroup>

                            {/* <FormGroup controlId="ID">
                                <ControlLabel>Container ID</ControlLabel>
                                <FormControl readOnly value={this.state.id} name="ID" />
                                <HelpBlock>Required</HelpBlock>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Item</ControlLabel>
                                <FormControl name="item_name" />
                                <HelpBlock>Required</HelpBlock>
                            </FormGroup> */}

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close} appearance="primary">
                            Confirm
              </Button>
                        <Button onClick={this.close} appearance="subtle">
                            Cancel
              </Button>
                    </Modal.Footer>
                </Modal>
                <Button onClick={this.open}>New Container</Button>
               
            </div>
        );
    }
}

class ScanFilter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type ? this.props.type : "error",
            found: "unknown",
        }
    }

    render() {



        return (
            <div className="scan_btns_filter">
                <div>{this.state.type}</div>
                <div>{this.state.found}</div>
                <img style={{marginTop:"10px"}} src={item_scan} alt="item_scan" />
            </div>
        )
    }

}