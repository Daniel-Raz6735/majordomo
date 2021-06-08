import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Button, Dropdown, Loader, Nav, Sidenav, Toggle } from "rsuite";
import { NavBar, showNotification } from "../../components/bars/bars";
import { determinLang, Dictionary } from "../../Dictionary";
import profilePic from "../../images/profile_pic.png";
import './settings_page.css'
import { changeLanguage } from '../../Dictionary'
import AdminPage from '../Admin Page/admin_page';
import $ from 'jquery';
import { base_url } from "../..";

var fake_settings = {
  lang: "EN",
  minimum_reach_alerts: true,
  freshness_alerts: true
}




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
  changePreference(setting, errorMessage,successFunc=undefined) {
    let settings = this.state.settings
    var request = base_url + "/edit/preferences"
    request += "?user_id=" + settings["user_id"] + "&" + setting
    $.ajax({
      method: "POST",
      url: request,
      success: function (res) {
        if(successFunc)
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

            <SideNavWrapper title="shlomo"
              content={
                [<DropdownToggle setting_name={"Supplier list"} />]
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
    this.setState({ open: false })
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
        <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} open={this.state.open}
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



export default SettingsPage


