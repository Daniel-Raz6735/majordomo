import React, {Component} from "react";
import { Nav_bar } from "../components/bars";
import './SettingPage.css'

class SettingsPage extends Component{
    constructor(props) {
        super(props);

    }


    render() {
            
        return (
            <div id="settings_page_container">
                <Nav_bar/>
                <div>
                  this is the settings area
                </div>
            </div>
            
        );

    }
}
export default SettingPage
