import React, { Component } from "react";
import { Dropdown, Loader, Nav, Sidenav, Toggle } from "rsuite";
import { NavBar } from "../components/bars";
import { Dictionary } from "../Dictionary";
import profilePic from "../images/profile_pic.png";
import './settings_page.css'
import { changeLanguage } from '../Dictionary'
import $ from 'jquery'
import { base_url } from "..";

var fake_settings = {
  lang: "EN",
  minimum_reach: true,
  freshnses: true
}


class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      settings: null
    }

    this.getPrefrences = this.getPrefrences.bind(this);
    this.setPrefrences = this.setPrefrences.bind(this);
  }

  componentDidMount() {
    this.getPrefrences(this.setPrefrences)

  }

  getPrefrences(callback) {

    let request = base_url + "/get/preferences"

    $.ajax({
      url: request,
      success: function (res) {
        callback(res);
        
      },
      error: function (err) {
        callback(fake_settings);
        
      }
    });
  }

  setPrefrences(data) {
    this.setState({ settings: data })
    
  }


  render() {

   

    let j
    if (this.state.settings) {
      let settings = this.state.settings

      j = settings["lang"] === "EN" ? 0 : 1
      


      return (
        <div className="settings_page_container">
          
          <div className="profile_details"><img className="profile_pic" alt="Profile" src={profilePic} /></div>

          <div className="side_nav_container">


            <div className="settings_issues">
              <Sidenav appearance="subtle" >
                <div className={"settings_container"}>general settings</div>
                <Nav>
                  <DropdownToggle type={"general"} setting_name={Dictionary["language"]} options={["English", "עברית"]} chosen={j} />
                </Nav>
              </Sidenav>

              <Sidenav>
                <Nav>
                  <DropdownToggle type={"general"} setting_name={"Integration"} options={["Priority", "Other"]} chosen={0} />
                </Nav>
              </Sidenav>

            </div>

            <div className="settings_issues">
              <Sidenav appearance="subtle" >
                <div className={"settings_container"}>Notification</div>
                <Nav>
                  <DropdownToggle minimum_reach={settings["minimum_reach"]} freshnses={settings["freshnses"]} type={"notification"} />
                </Nav>
              </Sidenav>

            </div>


            <div className="system_issues">
              <Sidenav appearance="subtle" >
                <div className={"settings_container"}>System</div>
                <Nav>
                  <DropdownToggle  type={"system"} setting_name={"Supplier list"} />
                </Nav>
              </Sidenav>

              <Sidenav appearance="subtle" >
                <Nav>
                  <DropdownToggle type={"system"} setting_name={"Inventory"} />
                </Nav>
              </Sidenav>
            </div>




          </div>
          <NavBar />
        </div>

      );
    } else
      return (<Loader speed="fast" size="lg" content="Loading..." center vertical />)

  }
}

class DropdownToggle extends Component {
  constructor(props) {
    super(props);
    var len = this.props.options ? this.props.options.length : 0

    this.state = {
      text_class: new Array(len),
      chosen: this.props.chosen ? this.props.chosen : 0,
      event_key: this.props.eventKey ? this.props.event_key : 1,
      options: this.props.options ? this.props.options : [],
    }
  }

  componentDidMount() {
    
    var len = this.props.options ? this.props.options.length : 0
    var textArr = new Array(len)
    textArr[this.state.chosen] = "chosen_option"
    this.setState({ text_class: textArr })
  }
  render() {

    let test

    switch (this.props.type) {
      default:
        break;

      case "general":
        let page = []
        for (let i = 0; i < this.state.options.length; i++) {
          let event_key = String(this.state.event_key) + "-" + String(i)
          let lang = i === 0 ? "EN" : "HE"

          page.push(<Dropdown.Item key={"dropdown_item"+i} eventKey={event_key} onSelect={changeLanguage(lang)} ><div className={this.state.text_class[i]} >{this.state.options[i]}</div></Dropdown.Item>)
        }

        test = <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} title={<div className="title_container" ><div className="setting_name">{this.props.setting_name}</div><div className="setting_value">{this.props.options[this.state.chosen]}</div></div>} >
          {page}
        </Dropdown>
        break;

      case "notification":
        test = <div>
          <div className="notification_system_toggler"> <div className="title_container" ><div className="setting_name">Minimum reach</div><div className="setting_value"><Toggle defaultChecked={this.props.minimum_reach} /></div></div></div>
          <div className="notification_system_toggler"> <div className="title_container" ><div className="setting_name">Freshness</div><div className="setting_value"><Toggle defaultChecked={this.props.freshnses} /></div></div></div>
        </div>
        break;

      case "system":
        test = <Dropdown toggleClassName='dropdown_title' title={<div className="title_container" ><div className="setting_name">{this.props.setting_name}</div><div className="setting_value"></div></div>}>

        </Dropdown>
    }


    return (
      <div className='dropdown_title'>
        {test}
      </div>
    );

  }
}
export default SettingsPage


