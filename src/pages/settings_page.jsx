import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Button, Dropdown, Loader, Nav, Sidenav, Toggle } from "rsuite";
import { NavBar } from "../components/bars";
import { Dictionary } from "../Dictionary";
import profilePic from "../images/profile_pic.png";
import './settings_page.css'
import { changeLanguage } from '../Dictionary'
import AdminPage from '../pages/Admin Page/admin_page';
import $ from 'jquery';
import {preference} from '../components/data_dictionary'

var fake_settings = {
  lang: "EN",
  minimum_reach_alerts: true,
  freshness_alerts: true
}




class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      settings: this.props.dict && this.props.dict["preferences"] ? this.props.dict["preferences"] : fake_settings,
      QR: false
    }
    this.changeNotificationToggle = this.changeNotificationToggle.bind(this);
    this.changeFreshnessToggle = this.changeFreshnessToggle.bind(this);

  }

  componentDidMount() {
    
  }

  changeNotificationToggle(val) {
    preference[0]["minimum_reach_alerts"] = val
  }

  changeFreshnessToggle(val) {
    preference[0]["freshness_alerts"] = val
  }


  render() {
    let j
    if (this.state.settings && !this.state.QR) {
      let settings = this.state.settings

      j = preference[0]["lang"] === "EN" ? 0 : 1
      // j = settings["lang"] === "EN" ? 0 : 1

      return (
        <div className="settings_page_container">

          <div className="profile_details"><img className="profile_pic" alt="Profile" src={profilePic} /></div>

          <div className="side_nav_container">
            {/* <button onClick={()=>this.setState({QR:true})} >QR Reader</button> */}
            <ManegmentBTN dict={this.props.dict} />
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
                  <DropdownToggle change1={this.changeNotificationToggle} change2={this.changeFreshnessToggle} minimum_reach={preference[0]["minimum_reach_alerts"]} freshnses={preference[0]["freshness_alerts"]} type={"notification"} />
                  {/* <DropdownToggle change={this.changeNotificationToggle}  minimum_reach={settings["minimum_reach_alerts"]} freshnses={settings["freshness_alerts"]} type={"notification"} /> */}
                </Nav>
              </Sidenav>

            </div>


            <div className="system_issues">
              <Sidenav appearance="subtle" >
                <div className={"settings_container"}>System</div>
                <Nav>
                  <DropdownToggle type={"system"} setting_name={"Supplier list"} />
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

          page.push(<Dropdown.Item key={"dropdown_item" + i} eventKey={event_key} onSelect={changeLanguage(lang)} ><div className={this.state.text_class[i]} >{this.state.options[i]}</div></Dropdown.Item>)
        }

        test = <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} title={<div className="title_container" ><div className="setting_name">{this.props.setting_name}</div><div className="setting_value">{this.props.options[this.state.chosen]}</div></div>} >
          {page}
        </Dropdown>
        break;

      case "notification":
        test = <div>
          <div className="notification_system_toggler"> <div className="title_container" ><div className="setting_name">Minimum reach</div><div className="setting_value"><Toggle onChange={this.props.change1} defaultChecked={this.props.minimum_reach} /></div></div></div>
          <div className="notification_system_toggler"> <div className="title_container" ><div className="setting_name">Freshness</div><div className="setting_value"><Toggle onChange={this.props.change2} defaultChecked={this.props.freshnses} /></div></div></div>
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


