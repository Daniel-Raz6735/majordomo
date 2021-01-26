import { Component } from "react";
import { Dictionary } from "../Dictionary";



class InventoryPage extends Component{
    constructor(props) {
        super(props);

    }

    render() {
        var temp =  Date.now()
        var now = new Date(temp)
        let hour = now.getHours()
        let minutes = now.getMinutes()
        let Seconds = now.getSeconds()

               var str = hour +"."+minutes+"."+Seconds

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