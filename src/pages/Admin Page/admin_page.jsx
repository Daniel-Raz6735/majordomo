import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Col, Container, Content, ControlLabel, Drawer, Dropdown, Footer, Form, FormControl, FormGroup, Header, HelpBlock, Icon, Modal, Nav, Navbar, Table } from 'rsuite';
import LoginComponent from '../login page/LoginPage';
import './admin_page.css';
import $ from 'jquery';
import { base_url } from '../..';
const { Column, HeaderCell, Cell, Pagination } = Table;


const users_columns = [
    { column_name: "id", editble: false, data_key: "user_id", width: 65 },
    { column_name: "First Name", editble: true, data_key: "first_name", width: 100 },
    { column_name: "Last Name", editble: true, data_key: "last_name", width: 100 },
    { column_name: "Email", editble: true, data_key: "email", width: 200 },
    { column_name: "Phone number", editble: true, data_key: "phone_number", width: 150 },
    { column_name: "Address", editble: true, data_key: "address", width: 200 },
]

const business_columns = [
    { column_name: "Business id", editble: true, data_key: "business_id", width: 100 },
    { column_name: "Department id", editble: true, data_key: "department_id", width: 100 },
]

const container_columns = [
    { column_name: "Container_id", editble: false, data_key: "container_id", width: 100 },
    { column_name: "Business id", editble: true, data_key: "business_id", width: 100 },
    { column_name: "Item name", editble: true, data_key: "item_name", width: 100 },
    { column_name: "item id", editble: true, data_key: "item_id", width: 100 },
]




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
                <Container>
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
                </Container>

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

    processUsers(data) {
        console.log(data)
        if (data && data["users"])
            this.props.loadPage(<EditTable key={"user_table"} table_data_key={"user_id"} columns={users_columns.concat(business_columns)} data={data["users"]} />)
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
            <Nav.Item icon={<Icon icon="user" />} ><div onClick={() => { this.getUsers() }}>users</div></Nav.Item>
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
        this.processContainers = this.processContainers.bind(this)
        this.getContainers = this.getContainers.bind(this)
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
    getContainers() {
        var request = base_url + '/get/containers';
        var callback = this.processContainers
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
    processContainers(data) {
        console.log(data)
        if (data)
            this.props.loadPage(<EditTable key={"container_table"} table_data_key={"container_id"} columns={container_columns} data={data} />)
        else
            this.props.loadPage(<div>We were unable to find the container data</div>)
    }




    render() {

        return (
            // <div className="control_containers">


            <Dropdown title="containers">
                <Dropdown.Item onClick={this.getContainers}>
                    Get containers
                    </Dropdown.Item>
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
        <Cell {...props} className={editing ? 'table-content-editing' : ''} >
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
        </Cell>
    );
};

const ActionCell = ({ rowData, dataKey, onClick, ...props }, datakey) => {
    console.log(rowData[props.data_key])
    console.log(props)
    console.log(rowData)
    console.log(dataKey)

    const editing = rowData.status === 'EDIT'
    const backBtn = editing ? <Button
        appearance="link"
        onClick={() => {
            onClick && onClick(rowData[dataKey], false);
        }}
    >
        back
    </Button> : ""
    return (
        <Table.Cell {...props} style={{ padding: '6px 0' }}>
            <Button
                appearance="link"
                onClick={() => {
                    onClick && onClick(rowData[dataKey], true);
                }}
            >
                {editing ? 'Save' : 'Edit'}
            </Button>
            {backBtn}
        </Table.Cell>
    );
};

class EditTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: "",
            data: props.data
        }

        this.load_table = this.load_table.bind(this)
        this.handleEditState = this.handleEditState.bind(this)
        this.setData = this.setData.bind(this)

    }

    componentDidMount() {
        this.load_table(this.props.columns)
    }
    setData(data) {
        this.setState({ data });
    }



    handleEditState = (id) => {
        const nextData = Object.assign([], this.state.data);
        const activeItem = nextData.find(item => item.id === id);
        activeItem.status = activeItem.status ? null : 'EDIT';
        this.setData(nextData);
    };
    load_table(columns) {
        /*this function gets an array that contains a dict with all columns information for each column in this format:
        {column_name:
        editble:
        data_key:
        width:} */

        var table = []
        if (columns) {
            columns.forEach(col => {
                table.push(<Column width={col["width"] ? col["width"] : ""} resizable>
                    <HeaderCell>{col["column_name"]}</HeaderCell>
                    <EditCell dataKey={col["data_key"]} editble={col["editble"]} onChange={this.props.handleChange} />
                </Column>)

            })
            this.setState({ table });
        }
    }

    render() {
        return (
            <Table height={500} data={this.state.data} autoHeight affixHeade>
                {this.state.table}
                <Column width={130} resizable>
                    <HeaderCell>Action</HeaderCell>
                    <ActionCell dataKey={this.props.table_data_key} onClick={this.handleEditState} />
                </Column>

            </Table>
        )
    }
}

