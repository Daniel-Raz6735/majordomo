import { Component } from "react";
import { Dictionary } from "../Dictionary";



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
            <div id="test">
                safdnklasnjsafasfnkasnkasfnkkasfklfsaklfmnasklfmsaklfmkas
                    afnjsafnlasnflksafmnklasfmklasfmklasfmsafklmasfklfmsaklas
                    {Dictionary["inventory"] + "| "+str}
            </div>
          
        );

    }


}
export default InventoryPage