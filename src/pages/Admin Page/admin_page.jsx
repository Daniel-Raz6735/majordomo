import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button,  Container,  ControlLabel,  Dropdown, Form, FormControl, FormGroup, Header, HelpBlock, Icon, Modal, Nav, Navbar, Table } from 'rsuite';
import LoginComponent from '../login page/LoginPage';
import './admin_page.css';
import $ from 'jquery';
import { base_url } from '../..';
const { Column, HeaderCell, Cell } = Table;


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
    { column_name: "Item name", editble: false, data_key: "item_name", width: 100 },
    { column_name: "item id", editble: false, data_key: "item_id", width: 100 },
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
        console.log(this.props.dict)

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
                                    <ControlUsers loadPage={this.loadPage} dict={this.props.dict} />
                                    <ControlContainers loadPage={this.loadPage} dict={this.props.dict} />
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
            this.props.loadPage(<EditTable key={"user_table"} request_name={"user"} tableDataKey={"user_id"} columns={users_columns.concat(business_columns)} data={data["users"]} />)
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
        var request = base_url + '/get/containers?only_active_containers=true';
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
        var page = data ? <EditTable key={"container_table"} request_name={"container"} tableDataKey={"container_id"} columns={container_columns} data={data} />
            : <div>We were unable to find the container data</div>

        this.props.loadPage(page)
    }

    render() {

        return (
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
        )
    }
}

export const EditCell = ({ rowData, colDataKey, saveChange, editable, ...props }) => {
    const editing = rowData.status === 'EDIT' && editable;
    var presentation = editing ? (
        <input
            className="rs-input"
            defaultValue={rowData[colDataKey]}
            onChange={event => {
                saveChange && saveChange(rowData, colDataKey, event.target.value);
            }}
        />) : (<span className="table-content-edit-span">{rowData[colDataKey]}</span>)


    return (
        <Cell {...props} className={editing ? 'table-content-editing' : ''} >
            {presentation}
        </Cell>
    );
};

const ActionCell = ({ rowData, handleEdit, handleSave, handleCancel, tableDataKey, ...props }) => {

    const cancelBtn = <Button appearance="link" onClick={() => { handleCancel && handleCancel(rowData[tableDataKey]) }}> {"Cancel"}</Button>
    const saveBtn = <Button appearance="link" onClick={() => { handleSave && handleSave(rowData[tableDataKey]) }}> {'Save'}</Button>
    const editBtn = <Button appearance="link" onClick={() => { handleEdit && handleEdit(rowData[tableDataKey]) }}> {'Edit'}</Button>

    const btns = (rowData.status === 'EDIT') ? [saveBtn, cancelBtn] : [editBtn]
    return (
        <Table.Cell {...props} style={{ padding: '6px 0' }}>
            {btns}
        </Table.Cell>
    );
};

class EditTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: "",
            data: props.data,
            changed_columns: {}
        }

        this.handleEditState = this.handleEditState.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.saveChange = this.saveChange.bind(this)
        this.load_table = this.load_table.bind(this)
    }

    componentDidMount() {
        this.load_table(this.props.columns)
    }

    saveChange = (rowData, colName, value) => {
        /* save changes localy in the table*/
        const tableDataKey = this.props.tableDataKey
        const id = rowData[tableDataKey]
        var changed_columns = this.state.changed_columns
        var changed_column = changed_columns[id]
        if (!changed_column) {
            const data = Object.assign([], this.state.data);
            changed_column = data.find(item => item[tableDataKey] === id)
        }
        changed_column[colName] = value;
        changed_columns[id] = changed_column;
        this.setState({ changed_columns });
    };

    handleCancel = (id) => {
        //remove data saved locally and set the row to be uneditable
        const changed_columns = this.state.changed_columns
        delete changed_columns[id]
        this.setState({ changed_columns });
        this.handleEditState(id);
    };

    handleSave = (id) => {
        /*save the column information in the server*/
        const changed_column = this.state.changed_columns[id]
        const request_name = this.props.request_name
        const colName = this.props.tableDataKey
        $.ajax({
            url: base_url + '/edit/' + request_name,
            type: "POST",
            data: changed_column,
            dataType: "application/json",
            success: function (res) {
                console.log(res)
                console.log("success sending information")
                console.log(changed_column)
            },
            error: function (err) {
                // todo add notification to user
                console.log(err);
                console.log("Unable to save the information for column: " + colName + ": " + id);
            }
        });
        this.handleEditState(id);
    };

    handleEditState = (id) => {
        /* change the state of a row*/
        const data = Object.assign([], this.state.data);
        const activeItem = data.find(item => item[this.props.tableDataKey] === id);
        activeItem.status = activeItem.status ? null : 'EDIT';
        this.setState({ data });
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
                    <EditCell colDataKey={col["data_key"]} editable={col["editble"]} saveChange={this.saveChange} />
                </Column>)

            })
            this.setState({ table });
        }
    }

    render() {



        return (
            <Table data={this.state.data} autoHeight affixHeader>
                {this.state.table}
                <Column width={135}>
                    <HeaderCell>Action</HeaderCell>
                    <ActionCell handleEdit={this.handleEditState} handleCancel={this.handleCancel} handleSave={this.handleSave} tableDataKey={this.props.tableDataKey} />
                </Column>
            </Table>
        )
    }
}

