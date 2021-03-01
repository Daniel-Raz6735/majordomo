import React, { Component } from "react";
import { ButtonsComponent, TitleComponent } from "../components/bars";
import { Animation, Dropdown, Icon, Loader } from 'rsuite';
import whatsapp_icon from '../images/icons/contact/whatsapp.svg';
import phone_icon from '../images/icons/contact/phone.svg';
import envelope_icon from '../images/icons/contact/envelope.svg';
import up_arrow from '../images/icons/arrows/up_arrow.svg';
import down_arrow from '../images/icons/arrows/down_arrow.svg';
import $ from 'jquery'
import './orders_page.css'

const { Collapse, Transition } = Animation;

class OrdersPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sellers: [],
            btn_styles: [],
            page: []

        }
        this.call_back = this.call_back.bind(this);

    }

    // this.render_by_category(this.state.categories[i])


    call_back(seller_dict) {
        console.log(seller_dict)
    }

    render() {
        var fake_orders = {
            "supplier_id": {
                        "items": {
                            "1": {
                                "unit": "kg",
                                "amount": 20
                            },
                            "2": {
                                "unit": "kg",
                                "amount": 30
                            }
                        }
                    },
            "1": {
                        "items": {
                            "1": {
                                "unit": "kg",
                                "price_per_unit": null,
                                "amount": 20
                            },
                            "2": {
                                "unit": "kg",
                                "price_per_unit": null,
                                "amount": 30
                            }
                        }
                    }
                
            
        }

        return (
            <div id="orders_page_container">
                <TitleComponent title_name="orders" />
                <ButtonsComponent key="Order_btns" btn_names={["item_type", "supplier"]} callback={this.call_back} />
                <OrderList dict={fake_orders} />
            </div>

        );

    }
}
export default OrdersPage

//1
export class OrderList extends Component {
    //this component will get a dictionary with one seller and will make a list out of it. 
    constructor(props) {
        super(props);
        this.state = {
            page: []
        }
        this.sort_dict = this.sort_dict.bind(this);

    }
    componentDidMount() {

        var fake_suplier = {
            "supplier_id":
            {
                "business_id": {
                    "item_id": {
                        days_to_provide: "1011010", // 7 numbers. for seven days. 1 for sending 0 if not
                        frequency: "daily",
                        preferred_contact: "email"
                    }





                }
            }
        }



    }
    sort_dict() {
        var page = []
        var dict = this.props.dict
        Object.keys(dict).forEach(element => {
            page.push(<OrderCategory order_dict={dict[element]} />)
            page.push(<AddItem />)
        });
        return page;
    }
    render() {
        return (
            <div >
                {this.sort_dict()}
            </div>

        );

    }
}


//2
class OrderCategory extends Component {
    constructor(props) {
        super(props);
        this.remove_onClick = this.remove_onClick.bind(this);
        this.extract_items = this.extract_items.bind(this);
        this.state = {
            page: [],
            show: true,

        };

    }

    remove_onClick(e) {
        if (e && $(e.target).attr('class')) {

            if ($(e.target).attr('class').includes('notification_toggler')) {
                this.setState({ show: !this.state.show });
            }
        }
        else
            console.log("no e target enterd")
    }

    //extract the items in to Notification components if there are no notifications 
    extract_items(order_data) {
        var page = []
        if (order_data) {
            Object.keys(order_data).forEach(order_id => {
              
                page.push(<Order order = {order_data[order_id]}/>)
                console.log(order_data[order_id])
            })
            
        }
        return page;
    }
    //                 business_id: ""
    // categories: {1: {…}}
    // order_creator_id: ""
    // order_date: ""
    // price: ""
    // var items_in_level = order_data[notification_level]

    // if (items_in_level) {
    //     Object.keys(items_in_level).forEach(item_id => {
    //         var obj = items_in_level[item_id]
    // item_id={item_id} key={item_id + notification_level + "notification" } notification_level={obj["notification_level"]} item_name={obj["item_name"]} total_weight={obj["total_weight"]}
    //     })
    // }
    // page.push(<Order key={item_id + notification_level + "notification" } notification_level={obj["notification_level"]} item_name={obj["item_name"]} total_weight={obj["total_weight"]} item_id={item_id} />)


    render() {
        return (
            <div className="notification_category_container">
                <OrderHeader key={"header" + this.props.cat_type + this.props.category_id} cat_name={"category name"} cat_type={this.props.cat_type} on_click={this.remove_onClick} weights_dict={this.props.weights_dict} cat_id={this.props.category_id} />
                <Collapse in={this.state.show} key={this.props.category_id + "collapse" + this.props.cat_type} >
                    {(props, ref) => <Panel {...props} ref={ref} key={this.props.category_id + " panel " + this.props.cat_type} orders={this.extract_items(this.props.order_dict)} />}
                </Collapse>
            </div>
        );
    }
}

//3
export class Order extends Component {

    constructor(props) {
        super(props);

        // var notification_level = props.notification_level
        // if (!notification_dict[notification_level]) {
        //     console.log("no notification configerd for notification_level " + notification_level)
        // }
        // else
        this.state = {
            // notification_level: notification_level,
            // item_name: props.item_name,
            // total_weight: props.total_weight,
            // message: props.message ? props.message : notification_dict[notification_level]["message"],
            // action_btn: action_btn(props.defult_weight, notification_level, props.item_name),
            // error_symbol: notification_dict[notification_level]["error_symbol"],
            // color: notification_dict[notification_level]["color"]
        }
    }

    render() {
        console.log(this.props.order)
        if (this.state) {
            return (
                <div className="notification_container">
                        dkjvdfkgnkdfgk
                    {/* <NotificationSymbol key={this.props.item_id+ "symbol"} color={this.state.color} error_symbol={this.state.error_symbol} /> */}
                </div>
            )
        }
        else
            return <div></div>
    }
}
export class AddItem extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="add_item_container">
              +  add item
            </div>
        )
    }
}


//3 container
const Panel = React.forwardRef(({ ...props }, ref) => (
    <div
        {...props}
        ref={ref}
        id="notification_collapse"
        style={{ width: '100%', overflow: 'hidden' }}>
        {props.orders}
        
    </div>
));


//Panels button
export class OrderHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weights_dict: props.weights_dict,
            page: [],
            arrow: <img src={down_arrow} className="order_symbol" />

        }
    }

    render() {
        return (
            <div className="notificationHeader notification_toggler" onClick={(e) => this.props.on_click(e)}  >
                {this.props.cat_name}
                <div className="centerPhotos">
                    <img src={whatsapp_icon} className="order_symbol" />
                    <img src={phone_icon} className="order_symbol" />
                    <img src={envelope_icon} className="order_symbol" />


                </div>
                {this.state.arrow}
            </div>

        )
    }
}
