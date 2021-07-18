import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Button, Dropdown, Icon, Loader, Nav, Sidenav, Toggle } from "rsuite";
import { NavBar, refresh, showNotification } from "../../components/bars/bars";
import { determinLang, Dictionary } from "../../Dictionary";
import { auth } from '../../config/firebaseConfig'
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
        refresh()
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

          <div className="profile_details"><img className="profile_pic" alt="Profile" src={profilePic} />
            <Icon icon={"exit"} id="logoutBtn" onClick={() => {
              auth.signOut()
              window.location.reload();

            }} >{Dictionary.signOut}</Icon>
          </div>

          <div className="side_nav_container">
            {/* <ManegmentBTN dict={this.props.dict} /> */}
            <SideNavWrapper title={Dictionary["general_settings"]}
              content={
                [<DropdownToggle setting_name={Dictionary["integration"]} options={["Priority", Dictionary["other"]]} chosen={"Priority"} disabled={true} />
                  , <DropdownToggle setting_name={Dictionary["language"]} options={["English", "עברית"]} chosen={"English"} onSelectFunction={changeLanguage} />
                ]
              } />

            <SideNavWrapper title={Dictionary["notifications"]}
              content={
                [<Toggler onChange={this.minimumReachToggle} setting_name={Dictionary["minimum_reach"]} checked={settings["minimum_reach_alerts"]} />,
                <Toggler onChange={this.changeFreshnessToggle} setting_name={Dictionary["freshness"]} checked={settings["freshness_alerts"]} />
                ]
              } />
            <UsersList key="users" />

            <SideNavWrapper title={Dictionary["system"]}
              content={
                [<ItemsList dict={this.props.dict} />]
              } />

          </div>

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
      if (sessionStorage.getItem("current_language") === 'HE')
        chosenIndex = 1
    }
    else
      options = []

    this.state = {
      chosenIndex: chosenIndex,
      event_key: this.props.eventKey ? this.props.event_key : 1,
      options: options,
      chosen: this.props.chosen,
      open: true,
      disabled: this.props.disabled ? true : false,
      lang_changed: false
    }
    this.onSelectFunction = this.onSelectFunction.bind(this);
  }

  onSelectFunction(ele) {
    // this.setState({ open: false })
    // console.log("bla")
    if (this.props.onSelectFunction)
      this.props.onSelectFunction(ele)


  }

  render() {
    let page = [], options = this.state.options
    for (let i = 0; i < options.length; i++) {
      let event_key = String(this.state.event_key) + "-" + String(i),
        className = i === this.state.chosenIndex ? "chosen_option" : ""
      if (!this.state.disabled)
        page.push(
          <Dropdown.Item key={"dropdown_item" + i} eventKey={event_key} onSelect={() => this.onSelectFunction(options[i])} >
            <div className={className} >
              {options[i]}
            </div>
          </Dropdown.Item>)
    }

    return (
      <div className='dropdown_title'>
        <Dropdown toggleClassName='dropdown_title' disabled={this.state.disabled} eventKey={String(this.state.event_key)}
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
    $.ajax({
      url: request,
      success: function (res) {
        thisS.processUsers(res)
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
          <div className="setting_name">{Dictionary["users"]}</div>
        </div>} >
        {this.state.page}
      </Dropdown>
    )
  }
}

export class UsersList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user_modals: [<Loader speed="fast" size="xs" content="Loading..." vertical />],
      supplier_modals: [<Loader speed="fast" size="xs" content="Loading..." vertical />],
      business_id: this.props.business_id ? this.props.business_id : 1

    }

    this.getUsers = this.getUsers.bind(this);
    this.processUsers = this.processUsers.bind(this);

  }

  componentDidMount() {
    this.getUsers();
  }
  processUsers(data) {
    if (data && data["users"] && data["users"].length > 0) {
      var users = data["users"], supplier_modals = [], user_modals = []
      users.forEach(user => {
        if (user && user["business_id"] === this.state.business_id)
          user_modals.push(<UserModal key={"user" + user["user_id"]} user={user} />)
        else
          supplier_modals.push(<UserModal user={user} key={"supplier" + user["user_id"]} />)
      })
      this.setState({
        user_modals,
        supplier_modals
      })
    }
    else
      console.log("unable to load users")

  }
  getUsers() {
    var request = base_url + '/get/users';
    var thisS = this
    $.ajax({
      url: request,
      success: function (res) {
        thisS.processUsers(res)
      },
      error: function (err) {
        console.log(err)
      }
    });
  }

  render() {

    return (
      <SideNavWrapper title="Users"
        key={"user_side_nav"}
        content={
          [
            <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} onToggle={(open) => { if (open) this.getUsers(); console.log("toggle") }} onOpen={this.getUsers}
              title={<div className="title_container">
                <div className="setting_name">{Dictionary["users"]}</div>
              </div>} >
              {this.state.user_modals}
            </Dropdown>,
            <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} onToggle={(open) => { if (open) this.getUsers(); console.log("toggle") }} onOpen={this.getUsers}
              title={<div className="title_container">
                <div className="setting_name">{Dictionary["suppliers"]}</div>
              </div>} >
              {this.state.supplier_modals}
            </Dropdown>]} />
    )
  }
}

export class ItemsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event_key: 1
    }
  }
  componentDidMount() {

    if (this.props.dict && this.props.dict["items"] && Object.keys(this.props.dict["items"]).length > 0) {
      let dict = this.props.dict["items"], item_modals = []
      Object.keys(dict).forEach(item => {
        let item_info = dict[item]
        if (item_info["item_id"]) {
          item_modals.push(<ItemModal item_info={item_info} {...this.props} />)
        }
      })
      this.setState({ item_modals })
    }

    else
      console.log("unable to load users")
  }

  render() {
    return (
      <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)}
        title={<div className="title_container">
          <div className="setting_name">{Dictionary["inventory"]}</div>
        </div>} >
        {this.state.item_modals}
      </Dropdown>
    )
  }
}

export class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    if (user) {
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
    let name = first_name + last_name

    return (
      <Dropdown.Item key={"dropdown_item" + id}   >
        <ModalTemplate
          modalContent={<UserInfo user={this.props.user} />} modalSize="lg" btnContent={name} modal_head={name} />
      </Dropdown.Item>
    );
  }
}

export class ItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    var name = "", id = "", item_info = this.props.item_info
    if (item_info) {
      if (item_info["item_id"]) {
        if (item_info["item_name"])
          name = item_info["item_name"] ? item_info["item_name"] : Dictionary["unknown"]
        id = item_info["item_id"]
      }
    }
    else {
      console.log("item not found")
      return ""

    }

    return (
      <Dropdown.Item key={"dropdown_item" + id}   >
        <ModalTemplate
          modalContent={<ItemExtendedInfo item_info={item_info} {...this.props} />} modalSize="lg" btnContent={name} modal_head={name} />
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
        <b>{Dictionary["user_id"]}:</b> {this.state.id}<p />
        <b>{Dictionary["first_name"]}:</b> {this.state.first_name}<p />
        <b>{Dictionary["last_name"]}:</b> {this.state.last_name}<p />
        <b>{Dictionary["email"]}:</b> {this.state.email}<p />
        <b>{Dictionary["address"]}:</b> {this.state.address}<p />
        <b>{Dictionary["phone_number"]}:</b> +{this.state.phone_number}<p />
      </div>
    );
  }
}

export class ItemExtendedInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event_key: 1
    }
    var item_info = this.props.item_info

    if (item_info && item_info["item_id"]) {
      let category = "", item_id = item_info["item_id"] ? item_info["item_id"] : "", cat_id = item_info["category_id"] ? item_info["category_id"] : undefined
      if (item_id && cat_id && this.props.dict && this.props.dict["weights"]
        && this.props.dict["weights"]["category"] && this.props.dict["weights"]["category"][cat_id]
        && this.props.dict["weights"]["category"][cat_id][item_id] &&
        this.props.dict["weights"]["category"][cat_id][item_id]["cat_name"]) {
        category = this.props.dict["weights"]["category"][cat_id][item_id]["cat_name"]
      }
      this.state = {
        id: item_id,
        category: category,
        name: item_info["item_name"] ? item_info["item_name"] : "",
        barcode: item_info["barcode"] ? item_info["barcode"] : "",
        minimum: item_info["content_total_minimum"] ? item_info["content_total_minimum"] : "",
        maximum: item_info["content_total_maximum"] ? item_info["content_total_maximum"] : "",
      };
    }
  }

  render() {
    if (!this.state["id"])
      return ""
    return (
      <div className="item_info">
        <b>{Dictionary["item_name"]}:</b> {this.state.name}<p />
        <b>{Dictionary["category"]}:</b> {this.state.category}<p />
        <b>{Dictionary["item_id"]}:</b> {this.state.id}<p />
        <b>{Dictionary["min"]}:</b> {this.state.minimum}<p />
        <b>{Dictionary["max"]}:</b> {this.state.maximum}<p />
        <b>{Dictionary["barcode"]}:</b> {this.state.barcode}<p />
      </div>
    );
  }
}

export default SettingsPage

function pharsePhoneNumber(number, areaCode = "972") {
  return areaCode + number
}
