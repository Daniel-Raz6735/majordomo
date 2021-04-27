import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Container, Content, ControlLabel, Drawer, Dropdown, Footer, Form, FormControl, FormGroup, Header, HelpBlock, Icon, Modal, Nav, Navbar } from 'rsuite';
import LoginComponent from '../login page/LoginPage';
import './admin_page.css';
import $ from 'jquery';





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
                {instance}
               <ControlUsers/>
               
               <div onClick={()=>{
                   $("#fullroot").prop('id', 'root');
                    ReactDOM.render(<LoginComponent />, document.getElementById('root'));}}>
               <Button color="red">Back</Button>
               </div>
            </div >

        )
    }
}
export default AdminPage

class ControlUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

        // this.open = this.open.bind(this)

    }


    render() {

        return (
            <div className="control_users">
              <Button className="admin_btns">add users</Button>
            </div >

        )
    }
}
class ControlContainers extends Component {

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
            // <div className="control_containers">
              
                
               <Dropdown title="containers">
                  <Dropdown.Item onClick={this.open}>
                      Associate container with a business
                    </Dropdown.Item>
                      <Modal backdrop={"static"} className="add_container_area" show={this.state.show} onHide={this.close} >
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
                    
                </Dropdown>
                // </div >

        )
    }
}

const instance = (
    <div className="show-fake-browser navbar-page">
      <Container>
        <Header>
          <Navbar appearance="subtle">
            <Navbar.Header>
              <a className="navbar-brand logo">Majordomo</a>
            </Navbar.Header>
            <Navbar.Body>
              <Nav>
                <Nav.Item icon={<Icon icon="home" />}>Home</Nav.Item>
                <Dropdown title="users">
                  <Dropdown.Item>Company</Dropdown.Item>
                  <Dropdown.Item>Team</Dropdown.Item>
                  <Dropdown.Item>Contact</Dropdown.Item>
                </Dropdown>
                <ControlContainers/>
              </Nav>
              <Nav pullRight>
                <Nav.Item >leave</Nav.Item>
                </Nav>
            </Navbar.Body>
          </Navbar>
        </Header>
        <Content>Content</Content>
        {/* <Footer>Footer</Footer> */}
      </Container>
    </div>
  );