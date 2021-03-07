import React, { Component } from "react";
import { Dropdown, Nav, Sidenav, Icon } from "rsuite";
import { NavBar } from "../components/bars";
import { Dictionary } from "../Dictionary";
import './settings_page.css'


class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true

    }
  }


  render() {

    return (
      <div id="settings_page_container">
        <NavBar />
        <div className={"side_nav_container"}>
          <Sidenav appearance="subtle" >
            {/* <Sidenav.Body> */}
            <Nav>
              <div className={"settings_container"}>general settings</div>
              <DropdownToggle setting_name={Dictionary["language"]} options={["English", "עברית"]} chosen={0} />


            </Nav>
            {/* </Sidenav.Body> */}
          </Sidenav>
        </div>
      </div>

    );

  }
}

class DropdownToggle extends Component {
  constructor(props) {
    super(props);
    var len = this.props.options ? this.props.options.length : 0
    let chosen = this.props.chosen ? this.props.chosen : 0
    this.state = {
      text_class: new Array(len),
      chosen: chosen,
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
    let page = []
    for (let i = 0; i < this.state.options.length; i++) {
      let event_key = String(this.state.event_key) + "-" + String(i)
      page.push(<Dropdown.Item eventKey={event_key} ><div className={this.state.text_class[i]}>{this.state.options[i]}</div></Dropdown.Item>)
    }

    return (
      <div className='dropdown_title'>
        <Dropdown toggleClassName='dropdown_title' eventKey={String(this.state.event_key)} title={<div className="title_container" ><div className="setting_name">{this.props.setting_name}</div><div className="setting_value">{this.props.options[this.state.chosen]}</div></div>}>
          {page}
        </Dropdown>
      </div>
    );

  }
}
export default SettingsPage


