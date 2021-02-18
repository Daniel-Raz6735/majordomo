import React, {Component} from "react";
import { NavBar } from "../components/bars";
import './settings_page.css'

class SettingsPage extends Component{
    // constructor(props) {
    //     super(props);

    // }


    render() {
            
        return (
            <div id="settings_page_container">
                <NavBar/>
                <div>
                  this is the settings area
                </div>
            </div>
            
        );

    }
}
export default SettingsPage
