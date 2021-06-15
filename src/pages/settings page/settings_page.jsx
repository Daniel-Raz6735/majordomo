import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Button, Dropdown, Loader, Modal, Nav, Sidenav, Toggle } from "rsuite";
import { NavBar, showNotification } from "../../components/bars/bars";
import { determinLang, Dictionary } from "../../Dictionary";
import profilePic from "../../images/profile_pic.png";
import './settings_page.css'
import { changeLanguage } from '../../Dictionary'
import AdminPage, { EditTable } from '../Admin Page/admin_page';
import $ from 'jquery';
import { base_url } from "../..";
import { ModalTemplate } from "../../components/modal/madal";


var fake_settings = {
  lang: "EN",
  minimum_reach_alerts: true,
  freshness_alerts: true
}

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


class SettingsPage extends Component {
  constructor(props) {
    super(props);
    var settings = fake_settings
    if (this.props.dict && this.props.dict["preferences"] && this.props.dict["preferences"][0])
      settings = this.props.dict["preferences"][0]
    this.state = {
      expanded: true,
      settings: settings,
      QR: false
    }
    this.minimumReachToggle = this.minimumReachToggle.bind(this);
    this.changeFreshnessToggle = this.changeFreshnessToggle.bind(this);
    this.switchLang = this.switchLang.bind(this);
    this.changePreference = this.changePreference.bind(this);

  }

  componentDidMount() {

  }
  changePreference(setting, errorMessage, successFunc = undefined) {
    let settings = this.state.settings
    var request = base_url + "/edit/preferences"
    request += "?user_id=" + settings["user_id"] + "&" + setting
    $.ajax({
      method: "POST",
      url: request,
      success: function (res) {
        if (successFunc)
          successFunc()
      },
      error: function (err) {
        showNotification('error', "Setting Change faild", errorMessage)
        console.log(err)
      }
    });
  }



  minimumReachToggle(val) {
    this.changePreference("minimum_reach_alerts=" + val, "Unable to change minimum reach")
  }
  switchLang(lang) {
    lang = determinLang(lang)
    this.changePreference("lang=" + lang, "Unable to change Language", changeLanguage(lang))
  }

  changeFreshnessToggle(val) {
    this.changePreference("freshness_alerts=" + val, "Unable to change freshness")
  }


  render() {
    if (this.state.settings && !this.state.QR) {
      let settings = this.state.settings
      return (
        <div className="settings_page_container">

          <div className="profile_details"><img className="profile_pic" alt="Profile" src={profilePic} /></div>

          <div className="side_nav_container">
            {/* <ManegmentBTN dict={this.props.dict} /> */}
            <SideNavWrapper title="general settings"
              content={
                [<DropdownToggle setting_name={"Integration"} options={["Priority", "Other"]} chosen={"Priority"} active={false} />
                  , <DropdownToggle setting_name={Dictionary["language"]} options={["English", "עברית"]} chosen={"English"} onSelectFunction={changeLanguage} />
                ]
              } />

            <SideNavWrapper title="Notification"
              content={
                [<Toggler onChange={this.minimumReachToggle} setting_name={"Minimum reach"} checked={settings["minimum_reach_alerts"]} />,
                <Toggler onChange={this.changeFreshnessToggle} setting_name={"Freshness"} checked={settings["freshness_alerts"]} />
                ]
              } />

            <SideNavWrapper title="Users"
              content={
                [<UsersList />]
              } />

            <SideNavWrapper title="System"
              content={
                [<DropdownToggle setting_name={"Supplier list"} />,
                <DropdownToggle setting_name={"Inventory"} />
                ]
              } />



          </div>
          <NavBar />

        </div>

      );
    } else if (!this.state.settings && !this.state.QR)
      return (<Loader speed="fast" size="lg" content="Loading..." center vertical />)
    else
      return <div />

  }
}

const ManegmentBTN = (props) => {

  return (
    <Button onClick={() => {
      ReactDOM.render(<AdminPage dict={props.dict} />, document.getElementById('root'));
      $("#root").prop('id', 'fullroot');
    }}>Mangement</Button>

  );
}

class DropdownToggle extends Component {
  constructor(props) {
    super(props);
    var options = this.props.options, len = 0, chosenIndex = 0
    if (options && Array.isArray(options)) {
      len = options.length;
      chosenIndex = options.indexOf(this.props.chosen);
    }
    else
      options = []

    this.state = {
      chosenIndex: chosenIndex,
      event_key: this.props.eventKey ? this.props.event_key : 1,
      options: options,
      chosen: this.props.chosen,
      open: true
    }
    this.onSelectFunction = this.onSelectFunction.bind(this);
  }

  onSelectFunction(ele) {
    // this.setState({ open: false })
    console.log("bla")
    if (this.props.onSelectFunction)
      this.props.onSelectFunction(ele)
  }

  render() {
    let page = [], options = this.state.options
    for (let i = 0; i < options.length; i++) {
      let event_key = String(this.state.event_key) + "-" + String(i),
        className = i === this.state.chosenIndex ? "chosen_option" : ""

      page.push(
        <Dropdown.Item key={"dropdown_item" + i} eventKey={event_key} onSelect={() => this.onSelectFunction(options[i])} >
          <div className={className} >
            {options[i]}
          </div>
        </Dropdown.Item>)
    }

    return (
      <div className='dropdown_title'>
        <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)}
          title={<div className="title_container" >
            <div className="setting_name">{this.props.setting_name}</div>
            <div className="setting_value">{options[this.state.chosenIndex]}</div>
          </div>} >
          {page}
        </Dropdown>
      </div>
    );
  }
}
class Toggler extends Component {
  render() {
    return (
      <div className='dropdown_title'>
        <div className="notification_system_toggler">
          <div className="title_container" >
            <div className="setting_name">{this.props.setting_name}</div>
            <div className="setting_value">
              <Toggle onChange={this.props.onChange} defaultChecked={this.props.checked} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class SideNavWrapper extends Component {

  render() {
    var content = this.props.content, page = []
    if (Array.isArray(content)) {
      content.forEach(obj => {
        page.push(<Sidenav appearance="subtle" >
          <Nav>
            {obj}
          </Nav>
        </Sidenav>)
      })

    }
    else
      page = content
    return (
      <div className="system_issues">
        <div className={"settings_container"}>{this.props.title}</div>
        {page}
      </div>

    );

  }
}

export class ControlUsers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: [<Loader speed="fast" size="xs" content="Loading..." vertical />]

    }

    this.getUsers = this.getUsers.bind(this);
    this.processUsers = this.processUsers.bind(this);

  }

  componentDidMount() {
    this.getUsers();
  }
  processUsers(data) {
    if (data && data["users"]) {
      this.setState({
        page: <SideNavWrapper
          title="users"
          content={[
            <EditTable key={"user_table"} request_name={"user"} tableDataKey={"user_id"} columns={users_columns.concat(business_columns)} data={data["users"]} />
          ]}

        />
      })
    }
    else
      console.log("unable to load users")

  }
  getUsers() {
    var request = base_url + '/get/users';
    var thisS = this
    console.log(request)
    $.ajax({
      url: request,
      success: function (res) {
        thisS.processUsers(res)
        console.log(res)
      },
      error: function (err) {
        console.log(err)

      }
    });
  }

  render() {

    return (

      <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} onToggle={(open) => { if (open) this.getUsers(); console.log("toggle") }} onOpen={this.getUsers}
        title={<div className="title_container"
        >
          <div className="setting_name">{"Users"}</div>
        </div>} >
        {this.state.page}
      </Dropdown>
      // <Nav.Item icon={<Icon icon="user" />} ><div onClick={() => }>users</div></Nav.Item>
    )
  }
}

export class UsersList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: [<Loader speed="fast" size="xs" content="Loading..." vertical />]

    }

    this.getUsers = this.getUsers.bind(this);
    this.processUsers = this.processUsers.bind(this);

  }

  componentDidMount() {
    this.getUsers();
  }
  processUsers(data) {
    if (data && data["users"] && data["users"].length > 0) {
      var users = data["users"], page = []
      users.forEach(user => {
        page.push(<UserModal user={user} />)
      })
      this.setState({
        page: page
      })
    }
    else
      console.log("unable to load users")

  }
  getUsers() {
    var request = base_url + '/get/users';
    var thisS = this
    console.log(request)
    $.ajax({
      url: request,
      success: function (res) {
        thisS.processUsers(res)
        console.log(res)
      },
      error: function (err) {
        console.log(err)
      }
    });
  }

  render() {

    return (

      <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} onToggle={(open) => { if (open) this.getUsers(); console.log("toggle") }} onOpen={this.getUsers}
        title={<div className="title_container"
        // onOpen= {()=>{ this.getUsers() }} >
        // on= {()=>{ console.log("blallbl") }} >
        >
          <div className="setting_name">{"Users"}</div>
        </div>} >
        {this.state.page}
      </Dropdown>
      // <Nav.Item icon={<Icon icon="user" />} ><div onClick={() => }>users</div></Nav.Item>
    )
  }
}

export class UserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      business_id: this.props.business_id ? this.props.business_id : 1,
      item_data: [],
      container_data: [],

    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

  }

  close() {
    this.setState({ show: false });
  }
  open() {
    this.setState({ show: true });
  }

  render() {
    var first_name = "", last_name = "", id = "", user = this.props.user
    if (user && user["business_id"] === this.state.business_id) {
      if (user["user_id"]) {
        if (user["first_name"])
          first_name = user["first_name"]
        if (user["last_name"])
          last_name = " " + user["last_name"]
        id = user["user_id"]
      }

    }
    else
      return ""
    console.log(user)
    let name = first_name + last_name

    return (
      <Dropdown.Item key={"dropdown_item" + id}   >
        <ModalTemplate
          modalContent={<UserInfo user={this.props.user} />} modalSize="lg" btnContent={name} modal_head={name} />
      </Dropdown.Item>
    );
  }
}

export class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    var user = this.props.user
    if (user && user["user_id"]) {
      this.state = {
        id: user["user_id"],
        first_name: user["first_name"] ? user["first_name"] : "",
        last_name: user["last_name"] ? user["last_name"] : "",
        email: user["email"] ? user["email"] : "",
        address: user["address"] ? user["address"] : "",
        phone_number: user["phone_number"] ? pharsePhoneNumber(user["phone_number"]) : ""

      };
    }

  }

  render() {
    if (!this.state.id)
      return ""
    return (
      <div className="user_info">
        <b>User id:</b> {this.state.id}<p />
        <b>First name:</b> {this.state.first_name}<p />
        <b>Last name:</b> {this.state.last_name}<p />
        <b>Email:</b> {this.state.email}<p />
        <b>Address:</b> {this.state.address}<p />
        <b>Phone number:</b> +{this.state.phone_number}<p />
      </div>
    );
  }
}


export default SettingsPage

function pharsePhoneNumber(number, areaCode = "972") {
  return areaCode + number
}
