import { Component } from "react";
import { BottomBar, Nav_bar } from "../components/bars";
import {get_notifications,process_notifications} from "../components/notifications";
import { Dictionary } from "../Dictionary";
import './inventory_page.css'



class InventoryPage extends Component{
    constructor(props) {
        super(props);

    }


    render() {
        var temp =  Date.now()
        var now = new Date(temp)
        let date = now.getDate()
        let months = now.getMonth()+1
        let year = now.getFullYear()

               var str = date +"."+months+"."+year

               get_notifications(process_notifications,1)
        
        return (
            <div id="inventory_page">
               <Nav_bar/>
                    <div className="page_title">{Dictionary["inventory"] + " | "+str}</div>
                    <div id="first_notification"></div>
                <BottomBar />
            </div>
            
        );

    }
}
export default InventoryPage


//this function will call all of the data of notifications and food status
function call_current_info(){

}


