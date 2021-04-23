import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import './qr_reader.css'
import { Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Modal } from 'rsuite'

export class Test extends Component {
    state = {
        
    }

    //   handleScan = data => {
    //     if (data) {
    //       this.setState({
    //         result: data
    //       })
    //       console.log(data)
    //     }
    //   }
    handleError = err => {
        console.error(err)

    }

    componentDidMount() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            console.log("Let's get this party started")
            navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } }).catch(function (error) {
                console.log(error)
            })
            
            
        }
    }
    render() {
        return (
            <div>
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.props.handleScan}
                    style={{ width: '100%' }}
                />
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
        this.setState({
            id: value["id"],
            item_name: value["item_name"]
        });
        //   console.log(value)
        console.log(this.state.id)
    }
    render() {

        let comp = this.state.scaned ? <button onClick={() => this.setState({ scaned: false })}>scan again</button> : <Test handleScan={this.handleScan} />

        return (
            <div >
                <Modal backdrop={"static"} classPrefix='modal' className="add_container_area" show={this.state.show} onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>New Container</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            fluid
                            onChange={this.handleChange}
                            formValue={this.state.formValue}
                        >
                            <FormGroup>
                                {/* <Test handleScan={this.handleScan} /> */}
                                {comp}
                            </FormGroup>

                            <FormGroup controlId="ID">
                                <ControlLabel>Container ID</ControlLabel>
                                <FormControl readOnly value={this.state.ID} name="ID" />
                                <HelpBlock>Required</HelpBlock>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Item</ControlLabel>
                                <FormControl name="item_name" />
                                <HelpBlock>Required</HelpBlock>
                            </FormGroup>

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