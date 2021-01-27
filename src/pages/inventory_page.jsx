import { Component } from "react";
import { Button, ButtonToolbar } from "rsuite";
import { BottomBar, Nav_bar } from "../components/bars";
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

        return (
            <div id="inventory_page">
               <Nav_bar/>
                    <div className="page_title">{Dictionary["inventory"] + " | "+str}</div>
                    <Selctors />
                <BottomBar />
            </div>
            
        );

    }


}
export default InventoryPage


export const Selctors = (props) =>{

    return(
        <ButtonToolbar>
            <Button appearance="ghost">{Dictionary["item_type"]}</Button>                
            <Button appearance="ghost">{Dictionary["supplier"]}</Button>
         </ButtonToolbar>
    )
}

