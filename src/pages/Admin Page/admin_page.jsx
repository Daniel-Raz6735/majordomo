import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Col, Container, Content, ControlLabel, Drawer, Dropdown, Footer, Form, FormControl, FormGroup, Header, HelpBlock, Icon, Modal, Nav, Navbar, Table } from 'rsuite';
import LoginComponent from '../login page/LoginPage';
import './admin_page.css';
import $ from 'jquery';
import { base_url } from '../..';





class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "press to choose what to see"
        }

        this.loadPage = this.loadPage.bind(this)

    }

    loadPage(page) {
        this.setState({ page });
    }





    render() {

        return (
            <div className="admin_page">
                {/* <Container> */}
                <Header>
                    <Navbar appearance="subtle">
                        <Navbar.Header>
                            <a className="navbar-brand logo">Majordomo managemnt</a>
                        </Navbar.Header>
                        <Navbar.Body>
                            <Nav>
                                <ControlUsers loadPage={this.loadPage} />
                                <ControlContainers loadPage={this.loadPage} />
                            </Nav>
                            <Nav pullRight>
                                <Nav.Item >
                                    <div onClick={() => {
                                        $("#fullroot").prop('id', 'root');
                                        ReactDOM.render(<LoginComponent />, document.getElementById('root'));
                                    }}>
                                        leave {/* <Button color="red">Back</Button> */}
                                    </div>
                                </Nav.Item>
                            </Nav>
                        </Navbar.Body>
                    </Navbar>
                </Header>

                <div id="allpage">{this.state.page}</div>
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

        this.getUsers = this.getUsers.bind(this);
        this.processUsers = this.processUsers.bind(this);

    }

    processUsers(data){
        console.log(data)
        if(data && data["users"]){
            this.props.loadPage(<EditTable fakeData={data["users"]}/>)
            console.log("data loaded")
       
        }
        else
        console.log("unable to load users")

    }
    getUsers() {
        var request = base_url + '/get/users';
        var callback = this.processUsers
            $.ajax({
                url: request,
                success: function (res) {
                    callback(res);

                },
                error: function (err) {
                    console.log(err)

                }
            });
    }

    render() {

        return (
                <Nav.Item icon={<Icon icon="user" />} ><div onClick={()=>{this.getUsers()}}>users</div></Nav.Item>
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

export const EditCell = ({ rowData, dataKey, onChange, ...props }) => {
    const editing = rowData.status === 'EDIT';
    return (
      <Table.Cell {...props} className={editing ? 'table-content-editing' : ''}>
        {editing ? (
          <input
            className="rs-input"
            defaultValue={rowData[dataKey]}
            onChange={event => {
              onChange && onChange(rowData.id, dataKey, event.target.value);
            }}
          />
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Table.Cell>
    );
  };
  
  const ActionCell = ({ rowData, dataKey, onClick, ...props }) => {
    return (
      <Table.Cell {...props} style={{ padding: '6px 0' }}>
        <Button
          appearance="link"
          onClick={() => {
            onClick && onClick(rowData.id);
          }}
        >
          {rowData.status === 'EDIT' ? 'Save' : 'Edit'}
        </Button>
      </Table.Cell>
    );
  };
  const EditTable = (fakeData) => {
    const [data, setData] = React.useState(fakeData.filter((v, i) => i < 8));
    const handleChange = (id, key, value) => {
      const nextData = Object.assign([], data);
      nextData.find(item => item.id === id)[key] = value;
      setData(nextData);
    };
    const handleEditState = id => {
      const nextData = Object.assign([], data);
      const activeItem = nextData.find(item => item.id === id);
      activeItem.status = activeItem.status ? null : 'EDIT';
      setData(nextData);
    };
  
    return (
      <Table height={420} data={data}>
        <Col width={100}>
          <Table.HeaderCell>user id</Table.HeaderCell>
          <EditCell dataKey="firstName" onChange={handleChange} />
        </Col>
        <Col width={200}>
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <EditCell dataKey="firstName" onChange={handleChange} />
        </Col>
  
        <Col width={200}>
          <Table.HeaderCell>Last Name</Table.HeaderCell>
          <EditCell dataKey="lastName" onChange={handleChange} />
        </Col>
  
        <Col width={300}>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <EditCell dataKey="email" onChange={handleChange} />
        </Col>
  
        <Col width={200}>
          <Table.HeaderCell>phone number</Table.HeaderCell>
          <EditCell dataKey="phoneNumber" onChange={handleChange} />
        </Col>
  
        <Col width={400}>
          <Table.HeaderCell>address</Table.HeaderCell>
          <EditCell dataKey="address" onChange={handleChange} />
        </Col>
  
        <Col width={100}>
          <Table.HeaderCell>business id</Table.HeaderCell>
          <EditCell dataKey="businessId" onChange={handleChange} />
        </Col>
  
        <Col width={100}>
          <Table.HeaderCell>department id</Table.HeaderCell>
          <EditCell dataKey="departmentId" onChange={handleChange} />
        </Col>
  
        <Col flexGrow={1}>
          <Table.HeaderCell>Action</Table.HeaderCell>
          <ActionCell dataKey="id" onClick={handleEditState} />
        </Col>
      </Table>
    );
  };
  
