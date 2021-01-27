import React, { Component } from 'react';
import "./notifications.css"
import {base_url} from '../index'
import $ from 'jquery'
import ReactDOM from 'react-dom'
import { Item_block } from './containers';
import { Button, Animation, ButtonToolbar} from 'rsuite';
import { notification_dict } from './notifications_data';
import { Dictionary } from '../Dictionary';


const { Fade, Collapse, Transition } = Animation;

export class Notification_list extends Component{
    constructor(props) {
        super(props);
        this.state = {
            page:'',
            dict:props.dict
        }
        this.render_by_category = this.render_by_category.bind(this)
    }
    componentWillMount(){
        // var action_by_number = {
        //     0:{"action":arr[0],"action_desc":text_descp[0],"message":Dictionary["just_few"]},
        //     1:{"action":arr[0],"action_desc":text_descp[0],"message":Dictionary["running_low"]},
        //     2:{"action":arr[1],"action_desc":text_descp[1],"message":Dictionary["must_use"]}
        //     };
        
    }
    render_by_category(cat){
        var page = []
        var selected_dict = this.state.dict[cat]
        Object.keys(selected_dict).forEach(category =>{
            page.push(<Notification_ctegory category_name = {category} data ={selected_dict[category]}/>)
        })
        this.setState({page:page})
    }

    render(){
        this.render_by_category('category')

        return(
            <div className = "notification_container">
                <ButtonToolbar>
                    <Button appearance="ghost">{Dictionary["item_type"]}</Button>                
                    <Button appearance="ghost">{Dictionary["supplier"]}</Button>
                </ButtonToolbar>
                {this.state.page}
            </div>
        )
    }



}

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
        var dict = create_notification_dict(data);      
        ReactDOM.render( <div id ="first_notification" className="notification_block"><Notification_list dict = {dict} />{page}<div id ="insert_div"></div></div>,document.getElementById('first_notification'))
    }


}


function create_notification_dict(data){
    var dict =  
    {"category":{},
    "supplier":{}}
    data.forEach(element => {
        var item_name = element["item_name"],
            category = element["category_name"]
        if(!dict["category"][category])
            dict["category"][category] = {}
            
        dict["category"][category][item_name] = {"number":element["code"],
                                                 "item_name":item_name,
                                                 "total_weight":element["weight"]
    }
    });
    return dict
}

const Panel = React.forwardRef(({ ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      style={{
        background: '#000',
        width: 100,
        overflow: 'hidden'
      }}
    >
      <p>{props.category_name}</p>
     
      <p>Content Content Content</p>
    </div>
  ));
  
  class Notification_ctegory extends Component {
    constructor(props) {
      super(props);
      this.handleToggle = this.handleToggle.bind(this);
      this.extract_items = this.extract_items.bind(this);
      this.state = {
        page:'',
        show: true,
        category_name:props.category_name,
        data:props.data
      };
    }
  
    handleToggle() {
      this.setState({
        show: !this.state.show
      });
    }

    extract_items(data) {
        var page =[]
        Object.keys(data).forEach(item_name =>{
            var obj = data[item_name]
            console.log(obj)
            page.push(<Notification number={obj["number"]} item_name={obj["item_name"]} total_weight={obj["total_weight"]}  />)
        })

        this.setState({
          page:page
        });
      }


  
    render() {

        // this.extract_items(this.state.data)


      return (
        <div className="row">
          <Button onClick={this.handleToggle}>toggle</Button>
          
          <Collapse in={this.state.show}>{(props, ref) => <Panel {...props} ref={ref} />}</Collapse>
        </div>
      );
    }
  }
  

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
        get_notifications(process_notifications,1)
    }
    render(){


        return(
            <div>
                {/* <Dropdown  eventKey="3" title="Advanced" icon={<Icon icon="magic" />}>
            <Dropdown.Item eventKey="3-1"><Notification number={0} item_name="red" total_weight={26} /></Dropdown.Item>
            <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
            <Dropdown.Item eventKey="3-3">Loyalty</Dropdown.Item>
            <Dropdown.Item eventKey="3-4">Visit Depth</Dropdown.Item>
          </Dropdown> */}
          
            <div id ="first_notification" className="notification_block">
                {/* <Notification number={0} item_name="red" total_weight={26} />
                <Notification  number={1} item_name="yellow" total_weight={26}/>
            <Notification number={2} item_name="orange" total_weight={26}/> */}
                </div>
            </div>
        )
    }



}
export class Notification_Header extends Component{

    constructor(props) {
        super(props);
        this.state = {                
        }
    }

    componentWillMount(){
        
    }
    render(){
        return(
            <div className="notification_header">
                </div>
        )
    }



}


//   ReactDOM.render(<CollapseDemo />);

export class Notification extends Component{

    constructor(props) {
        super(props);
        var number = props.number
        this.state = {
            number:number,            
            item_name:props.item_name,
            total_weight: props.total_weight, 
            message:props.message?props.message:notification_dict[number]["message"],
            action_image: notification_dict[number]["action_image"] ,
            action_desc:notification_dict[number]["action_desc"],
            error_symbol:notification_dict[number]["error_symbol"],
            color:notification_dict[number]["color"]
        }
    }
    componentWillMount(){

        
    }

    render(){

        return(
            <div className = "notification_container">
                <div className="center_items left_notification_area">
                <img src ={this.state.action_image} className="notification_image left_img" alt={this.state.action_desc}/>
                {this.state.action_desc}
                </div>
                <div className="center_items notification_item_name">
                {this.state.item_name}
                </div>
                <div className="center_items notification_weight">
                <div>{this.state.total_weight}</div>
                </div>

                <div className = "notification center_items">
                    {this.state.message}
                </div>
               <NotificationSymbol color = {this.state.color} error_symbol = {this.state.error_symbol}/>                
            </div>
        )
    }



}





export const NotificationSymbol= (props) =>{ 
    var  symbol = props.error_symbol,
        color = {"background-color": props.color}
    
    return(
        <div className="notification_symbol_area center_items" style={color}>
                <img src ={symbol} className="notification_symbol"></img>
        </div>
    )


    

}