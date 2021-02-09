import React, { Component } from 'react';
import "./notifications.css"
import {base_url} from '../index'
import $ from 'jquery'
import ReactDOM from 'react-dom'
import { Button, Animation, ButtonToolbar} from 'rsuite';
import { action_btn, notification_dict } from './notifications_data';
import { Dictionary } from '../Dictionary';
import { CategoryDrawer } from './drawer';
import Nav from 'react-bootstrap/Nav';
import v_icon from '../images/icons/v icon.svg'
// import 'bootstrap/dist/css/bootstrap.min.css';



const { Fade, Collapse, Transition } = Animation;

export function get_notifications(callback, client_id){
    //request all notifications for a business
    var request = base_url+'/get/notifications';

    if (client_id){
        request += "?business_id="+ client_id + "&active=true"
    console.log(request)
    $.ajax({
        url: request, 
        success: function (res) {
            callback(res);
            console.log(res)
        },
        error: function (err) {
            console.log(err)
        }
    });
    }
    else{
        console.log("no user id enterd. nothing happend")
    }
    
}
export function get_initial_data(callback, business_id){
    //request all information for a business
    var request = base_url+'/get/current_view';

    if (business_id){
        request += "?business_id="+ business_id + "&active=true"
    console.log(request)
    $.ajax({
        url: request, 
        success: function (res) {
            callback(res);
            console.log(res)
        },
        error: function (err) {
            console.log(err)
        }
    });
    }
    else{
        console.log("no user id enterd. nothing happend")
    }
    
}


export function process_notifications(data){
    var page = []   
    if(typeof(data)=="object"){
        console.log(data)
        // var dict = create_notification_dict(data);      
        // ReactDOM.render( <Notification_list dict = {dict} />,document.getElementById('first_notification'))
    }


}
export function process_initial_data(data){
    if(typeof(data)=="object"){
        var dict = create_initial_data_dict(data[0]);  
        confirm_papulation(dict, "process_initial_data", "initial data not recived well" )  
        ReactDOM.render( <Notification_list dict = {dict} />,document.getElementById('first_notification'))
    }
    else{
        console.log("intial data returnd with bad body")
    }

}

function confirm_papulation(dict, area_name, message="", dict_to_test=false){
    message = message?"\nmessage: " +message:""
    if(dict){
        Object.keys(dict).forEach(key=>{
            if(dict_to_test){
                if(dict_to_test.includes(key))
                    console.log("couldent find "+key+" in "+area_name + message)
            }
            else if(!dict[key])
                console.log("couldent find "+key+" in "+area_name + message)
        })
    }
    else 
    console.log("no dictionary recived" + area_name + message)

}
function create_initial_data_dict(data){
    var dict =  {}
    if(data){
        dict["suppliers"] = create_suppliers_dict(data["suppliers"])
        dict["weights"] = create_weights_dict(data["weights"],dict["suppliers"])
        dict["notifications"] = create_notification_dict(data["notifications"],dict["suppliers"])
        confirm_papulation(dict, "create_initial_data_dict", "feild not recived from server")
        console.log(dict)
        return dict
    }
    else
        console.log("create_initial_data_dict no data recived")
}


// function create_notification_dict(data,suppliers){
//     var dict =  
//     {"category":{},
//     "supplier":{},
// }
//     Object.keys(data).forEach(key => {
//         var element = data[key]
//         var item_name = element["item_name"],
//             category_name = element["category_name"],
//             category_id = element["category_id"],
//             notification_code = element["code"],
//             item_weight = element["weight"],
//             element_to_insert = {"number":notification_code,
//                                 "item_name":item_name,
//                                 "total_weight":item_weight
//             }
//         if(!dict["category"][category_id])
//             dict["category"][category_id] = {}

//             dict["category"][category_id][item_name] = element_to_insert;

//         if(!dict["category"][category_id]["notification_codes"])
//             dict["category"][category_id]["notification_codes"] = []
//         dict["category"][category_id]["notification_codes"].push(notification_code)
        
//     });
//     return dict
// }

function create_notification_dict(notification_data, suppliers_data){
    var dict =  
    {"category":{},
    "supplier":{}}
    
    confirm_papulation(suppliers_data,"suppliers_data create_notification_dict")
    Object.keys(notification_data).forEach(key => {
        var element = notification_data[key]
        if(element){
            confirm_papulation(element,"create_notification_dict")
            console.log(element)
            var item_name = element["item_name"],
                item_id = element["item_id"],
                category_name = element["category_name"],
                category_id = element["category_id"],
                notification_code = element["code"],
                item_weight = element["weight"],
                element_to_insert = {"number":notification_code,
                                    "item_name":item_name,
                                    "item_id":item_id,
                                    "total_weight":item_weight
                                    }
                if(item_name && item_id && category_name && category_id && notification_code && item_weight){
                    if(!dict["category"][category_id])
                        dict["category"][category_id] = {}
                        dict["category"][category_id][item_name] = element_to_insert;
                    if(!dict["category"][category_id]["notification_codes"])
                        dict["category"][category_id]["notification_codes"] = []
                    dict["category"][category_id]["notification_codes"].push(notification_code)
                }
               
        }
    });
    return dict
}


function create_weights_dict(weight_data,suppliers_data){
    var dict =  
    {"category":{},
    "supplier":{}}
    
    confirm_papulation(suppliers_data,"suppliers_data create_weights_dict")
    Object.keys(weight_data).forEach(key => {
        var element = weight_data[key]
        if(element){
            confirm_papulation(element,"create_weights_dict")
            var item_name = element["item_name"],
                item_id = element["item_id"],
                category = element["category_id"],
                category_name = element["category_name"]
                if(item_name && item_id && category && category_name){
                    if(!dict["category"][category])
                        dict["category"][category] = {}
                        
                    dict["category"][category][item_id] = {
                                                            "cat_name":category_name,
                                                            "date":element["date"],
                                                            "item_name":item_name,
                                                            "total_weight":element["weight"],
                                                            "suppliers":{}
                    }
                    if(suppliers_data&&suppliers_data["items"]&&suppliers_data["items"][item_id]&&suppliers_data["items"][item_id]["suppliers"]){
                        var suppliers = suppliers_data["items"][item_id]["suppliers"]
                        suppliers.forEach(supplier_id => {
                            if (suppliers_data["suppliers"] && suppliers_data["suppliers"][supplier_id]){
                                dict["category"][category][item_id]["suppliers"][supplier_id] = suppliers_data["suppliers"][supplier_id]
                            }
                        });
                    }
                }
        }
    });
    return dict
}
function create_suppliers_dict(suppliers_data){
    var dict = {"items":{},
            "suppliers":{}
        }
    
    Object.keys(suppliers_data).forEach(key => {
        var element = suppliers_data[key]
        if(element){
            var supplier_info={},
                temp ={
                    "address" : element["address"],
                    "email" : element["email_user_name"] + "@" + element["email_domain_name"],
                    "first_name" : element["first_name"],
                    "last_name" : element["last_name"],
                    "phone_number" : element["phone_number"],
                    "preferred_contact" : element["preferred_contact"],
                },
                supplier_id = element["supplier_id"],
                item_id = element["item_id"],
                item_info = {
                    "supplier_id" : supplier_id,
                    "providing_days" :element["days_to_provide"],
                    "frequency" : element["frequency"]}
                               
                if (!element["email_user_name"] || !element["email_domain_name"])
                    temp["email"] = null

                
                Object.keys(temp).forEach(key => {
                    if (temp[key])
                        supplier_info[key]=temp[key]
                })
                supplier_info["sells_items"]={}

                if(item_id&&supplier_id&&element["frequency"]&&element["days_to_provide"]){
                    if(!dict["items"][item_id])
                        dict["items"][item_id] = {"suppliers":[]}
                    if(!dict["items"][item_id]["suppliers"].includes(supplier_id))
                        dict["items"][item_id]["suppliers"].push(supplier_id)

                    if(!dict["suppliers"][supplier_id])
                        dict["suppliers"][supplier_id] = supplier_info
                    supplier_info["sells_items"][item_id] = item_info

                }
                else{
                    console.log("missing objects for "+key+" create_suppliers_dict found: supplier_id:"+supplier_id+" ,item_id:"+item_id+ " , frequency: "+ element["frequency"]+ " , providing_days: "+ element["days_to_provide"] )
                }
        }
    });
    return dict
}


//1
export class Notification_list extends Component{
    constructor(props) {
        super(props);
        this.render_by_category = this.render_by_category.bind(this);
        this.state = {
            page:[],
            appearance:["primary","ghost"],
            temp:[{background:"#FD4141",color:"#FFFFFF","border-color":"#707070",width:"100px"},{background:"none",color:"#707070","border-color":"#707070",width:"100px"}],
            dict:props.dict
        }
        this.hendleFilter = this.hendleFilter.bind(this);
    }
    componentWillMount(){
        this.render_by_category('category')
    }
    render_by_category(cat){
        var page = []
        if(this.state.dict["notifications"] && this.state.dict["weights"]){
            var notifications_dict = this.state.dict["notifications"][cat]
            var weights_dict = this.state.dict["weights"][cat]
            confirm_papulation(weights_dict,"Notification_list","render_by_category missing weight attribute")
            confirm_papulation(notifications_dict,"Notification_list","render_by_category missing notification attribute")
            Object.keys(weights_dict).forEach(category =>{
                page.push(<Notification_ctegory category_id = {category} notification_dict ={notifications_dict[category]} weights_dict={weights_dict[category]}/>)
            })
            this.setState({page});
        }
        else{
            console.log("no notifications sent to Notification_list")
        }
    }

    hendleFilter(i){
        var styles =  [{background:"none",color:"#707070","border-color":"#707070",width:"100px"},{background:"none",color:"#707070","border-color":"#707070",width:"100px"}]
        styles[i] = {background:"#FD4141",color:"white","border-color":"#707070",width:"100px"}
        var appearances = ["ghost","ghost"]
        appearances[i] = "primary"
        this.setState({temp:styles,appearance:appearances})
    }


    render(){


        return(
            <div className = "notification_cover">
                <ButtonToolbar>
                    <Button onClick={()=> this.hendleFilter(0)} style={this.state.temp[0]} appearance={this.state.appearance[0]}>{Dictionary["item_type"]}</Button>                
                    <Button onClick={()=> this.hendleFilter(1)} style={this.state.temp[1]} appearance={this.state.appearance[1]}>{Dictionary["supplier"]}</Button>
                </ButtonToolbar>
                {/* <Testing /> */}
                 {this.state.page}
            </div>
        )
    }

}

 //2
 class Notification_ctegory extends Component {
    constructor(props) {
      super(props);
      this.handleToggle = this.handleToggle.bind(this);
      this.extract_items = this.extract_items.bind(this);
      this.state = {
        page:'',
        show: true,
        category_id:props.category_id,
        notifications_dict:props.notification_dict,
        weights_dict:props.weights_dict
      };
    }
    componentDidMount(){
        
    }
    handleToggle(e) {
        if(e){
            if ( $(e.target).attr('class').includes('notification_toggler')){
                this.setState({
                    show: !this.state.show
                }); 
            }
        }
        else{
            console.log("no e target enterd")
        }
    }

    extract_items(data) {
        var page =[]
        console.log(data)
        if (data){
            confirm_papulation(data,"extract items Notification_ctegory")
            Object.keys(data).forEach(item_name =>{
                var obj = data[item_name]
                page.push(<Notification number={obj["number"]} item_name={obj["item_name"]} total_weight={obj["total_weight"]}  />)
            })
           
        } 
        else{
            page.push(<OK_Notification/>)
        } 
        return page;
    }

    render() {
      return (
        <div className="notification_category_container">

          <Notification_Header on_click = {this.handleToggle} weights_dict = {this.state.weights_dict} cat_name={this.state.category_name} />
          <Collapse in={this.state.show}>{(props, ref) => 
            <Panel {...props} ref={ref} notifications ={this.extract_items(this.state.notifications_dict)} />}
            
          </Collapse>
        </div>
      );
    }
  }


//3
  export class Notification extends Component{

    constructor(props) {
        super(props);
        var number = props.number
        if (!notification_dict[number]){
            console.log("no notification configerd for number " + number)
        }
        else
            this.state = {
                number:number,            
                item_name:props.item_name,
                total_weight: props.total_weight, 
                message:props.message?props.message:notification_dict[number]["message"],
                action_btn: action_btn(props.defult_weight,number) ,
                error_symbol:notification_dict[number]["error_symbol"],
                color:notification_dict[number]["color"]
            }
    }

    render(){
        if(this.state)
            return(
                <div className = "notification_container">
                    <div className="center_items left_notification_area">
                    {this.state.action_btn}
                    </div>
                    <div className="center_items notification_item_name">
                    {this.state.item_name}
                    </div>
                    <div className="center_items notification_weight">
                    <div>{this.state.total_weight}</div>
                    </div>

                    <div className = "notification_message center_items">
                        {this.state.message}
                    </div>
                <NotificationSymbol color = {this.state.color} error_symbol = {this.state.error_symbol}/>                
                </div>
            )
        else
            return <div></div>
    }
}
export class OK_Notification extends Component{

    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        return(
            <div className = "notification_container">
                <div className="">{Dictionary["looks_good"]}  </div>
               <NotificationSymbol color = {"rgba(115, 213, 4, 0.21)"} error_symbol = {v_icon}/>                
            </div>
        )
    }
}


//3 container
const Panel = React.forwardRef(({ ...props }, ref) => (
    <div
    {...props}
    ref={ref}
    id = "notification_collapse"     
      style={{
      
        width: '100%',
        overflow: 'hidden'
      }}
    >
    {props.notifications}

      
    </div>
  ));
  
  //Panels button
  export class Notification_Header extends Component{
    constructor(props) {
        super(props);
        this.state = {   
            weights_dict:props.weights_dict,
            on_click:props.on_click,
            cat_name:props.weights_dict[Object.keys(props.weights_dict)[0]]["cat_name"]      
        }
    }

    render(){
        return(
            <div className="notification_header notification_toggler" onClick = {(e)=>this.state.on_click(e)} >
                {this.state.cat_name}
                <CategoryDrawer weights_dict = {this.state.weights_dict}/>
            </div>
          
        )
    }
}
  
//discontinued. will be deleted shortly
export class Notification_block extends Component{

    constructor(props) {
        super(props);
        this.state = {
            status:props.status,
            number:props.number,
            page: [],
            action:props.action,
            open:true
                 
        }
    }



    componentWillMount(){
        get_initial_data(process_initial_data,1)
    }
    render(){


        return(        
            <div id ="first_notification" className="notification_block">
                </div>
            
        )
    }



}


//reresents the corner of a notification with a symbol
export const NotificationSymbol= (props) =>{ 
    var  symbol = props.error_symbol,
        color = {"background-color": props.color}
    
    return(
        <div className="notification_symbol_area center_items" style={color}>
                <img src ={symbol} className="notification_symbol"></img>
        </div>
    )
}


export class Testing extends Component {

    constructor(props){
        super(props);
    }


    render(){

    return(
        <div>
        <Nav  variant="pills" defaultActiveKey="/item">
            <Nav.Item>
                <Nav.Link eventKey="/item" >Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="supplier">Option 2</Nav.Link>
            </Nav.Item>
        </Nav>
        </div>
    )

}
}