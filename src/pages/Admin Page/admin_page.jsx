import React, { Component } from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Modal } from 'rsuite';
import './admin_page.css'





class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            container_id: "",
            business_id: ""
        }

        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.associating = this.associating.bind(this)
    }

    open() {
        this.setState({ show: true })
    }

    close() {
        this.setState({
            show: false,
            business_id: "",
            container_id: ""
        })
    }

    handleChange(value) {
        console.log(value)
        this.setState({
            business_id: value["business_id"],
            container_id: value["container_id"]
        });

    }

    associating() {
        console.log(this.state.container_id + "\n " + this.state.business_id)

    }



    render() {

        return (
            <div className="admin_page">
                <Button className="admin_btns" onClick={this.open}>Associating a container with a business</Button>
                <Button className="admin_btns">add users</Button>

                <Modal backdrop={"static"} classPrefix='modal' className="add_container_area" show={this.state.show} onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>Associating a container with a business</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            fluid
                            onChange={this.handleChange}

                        >
                            <FormGroup controlId={"business_id"}>
                                <ControlLabel>Business ID</ControlLabel>
                                <FormControl value={this.state.business_id} name="business_id" />
                                <HelpBlock>Required</HelpBlock>
                            </FormGroup>


                            <FormGroup controlId={"container_id"}>
                                <ControlLabel>Container ID</ControlLabel>
                                <FormControl value={this.state.container_id} name="container_id" />
                                <HelpBlock>Required</HelpBlock>
                            </FormGroup>


                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.associating} appearance="primary">
                            Confirm
              </Button>
                        <Button onClick={this.close} appearance="subtle">
                            Cancel
              </Button>
                    </Modal.Footer>
                </Modal>
            </div >

        )
    }
}
export default AdminPage
