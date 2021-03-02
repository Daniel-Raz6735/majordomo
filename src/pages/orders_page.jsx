import React, { Component } from "react";
import { ButtonsComponent, TitleComponent } from "../components/bars";
import { Animation } from 'rsuite';
import whatsapp_icon from '../images/icons/contact/whatsapp.svg';
import phone_icon from '../images/icons/contact/phone.svg';
import envelope_icon from '../images/icons/contact/envelope.svg';
// import up_arrow from '../images/icons/arrows/up_arrow.svg';
import down_arrow from '../images/icons/arrows/down_arrow.svg';
import $ from 'jquery'
import './orders_page.css'
import { Dictionary, getRTL } from "../Dictionary";
import { CategoryDrawer, SearchBar } from "../components/drawer";
import { Quantity } from "./inventory_page";

const { Collapse } = Animation;

// class OrdersPage extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {


//         }
//         this.call_back = this.call_back.bind(this);

//     }

//     // this.render_by_category(this.state.categories[i])


//     call_back(seller_dict) {
//         // console.log(seller_dict)
//     }

//     render() {


//         return (
//             <div className="orders_page_container">
//                 <TitleComponent title_name="orders" />
//                 <ButtonsComponent key="Order_btns" btn_names={["item_type", "supplier"]} callback={this.call_back} />
//                 <SearchBar />
//                 <OrderList dict={this.props.dict} />
//             </div>

//         );

//     }
// }
// export default OrdersPage

function sort_by_key_val(jsObj, key, reverse) {
    var sortedArray = []
    Object.keys(jsObj).forEach(key => {
        // Push each JSON Object entry in array by [value, key]
        if (key)
            sortedArray.push([jsObj[key], key]);
        else
            sortedArray.push([key, jsObj[key]]);
    })
    sortedArray.sort()
    if (reverse)
        sortedArray.reverse()
    return sortedArray;
}

//1
export class OrdersPage extends Component {
    //this component will get a dictionary with one seller and will make a list out of it. 
    constructor(props) {
        super(props);
        this.state = {
            page: [],
            dict: props.dict
        }
        this.sort_dict = this.sort_dict.bind(this);
        this.call_back = this.call_back.bind(this);
        this.sort_by_supplier = this.sort_by_supplier.bind(this);


    }
    componentDidMount() {
        this.sort_dict(1)
    }

    call_back(toggle_number) {
        // console.log(seller_dict)
    }

    sort_dict(index) {
        var page = []


        if (page) {
            // suppliers_dict = dict["orders"]

            switch (index) {
                case 1://supplier
                default:
                    page = this.sort_by_supplier()
                    // current_dict = suppliers_dict["suppliers"]

                    break;
                case 0:// items
                    // current_dict = suppliers_dict["items"]
                    break;
            }
            // console.log(current_dict)
            // Object.keys(current_dict).forEach(key => {
            //     page.push(<OrderCategory order_dict={current_dict[key]} />)
            //     page.push(<AddItem />)
            // });
            this.setState({ page });
        }
        else {
            console.log("problem with data. try reloading")
        }
    }

    sort_by_supplier() {
        var dict = this.state.dict,
            suppliers_dict = "",
            page = [],
            orders_dict = dict["orders"]
        if (orders_dict)
            orders_dict = dict["orders"]["suppliers"]
        if (dict && dict["suppliers"] && dict["suppliers"]["suppliers"]) {
            suppliers_dict = dict["suppliers"]["suppliers"]
            var sellers = {}
            console.log(dict)
            if (suppliers_dict) {

                Object.keys(suppliers_dict).forEach(key => {

                    if (orders_dict && orders_dict[key])
                        sellers[key] = Object.keys(orders_dict[key]).length
                    else
                        sellers[key] = 0
                })
                var sorted_sellers = sort_by_key_val(sellers, false, true)
                let temp = dict["weights"]["supplier"]
                console.log(sorted_sellers)
                sorted_sellers.forEach(obj => {
                    page.push(<OrderCategory weights_dict={temp[obj[1]]} supplier={suppliers_dict[obj[1]]} />)
                })


            }
        }
        return page;
    }
    render_supplier(supplier) {
        if (supplier) {
            var sells_items = supplier["sells_items"]
            if (sells_items) {
                Object.keys(sells_items).forEach(key => {
                    if (sells_items[key]["order_details"])
                        console.log(sells_items[key]["order_details"])

                })



            }
            console.log(supplier["sells_items"])

        }
    }


    render() {
        console.log(this.props.dict)
        return (
            <div className="orders_page_container">
                <TitleComponent title_name="orders" />
                <ButtonsComponent key="Order_btns" def_btn={1} btn_names={["item_type", "supplier"]} callback={this.sort_dict} />
                <SearchBar />
                {this.state.page}
            </div>

        );

    }
} export default OrdersPage


//2
class OrderCategory extends Component {
    constructor(props) {
        super(props);
        this.remove_onClick = this.remove_onClick.bind(this);

        this.render_supplier = this.render_supplier.bind(this);
        this.state = {
            page: [],
            show: true,

        };

    }

    remove_onClick(e) {
        if (e && $(e.target).attr('class')) {

            if ($(e.target).attr('class').includes('order_toggler')) {
                this.setState({ show: !this.state.show });
            }
        }
        else
            console.log("no e target enterd")
    }
    render_supplier(supplier) {
        var page = []
        if (supplier) {
            var sells_items = supplier["sells_items"]
            console.log(supplier)

            if (sells_items) {
                console.log(sells_items)
                Object.keys(sells_items).forEach(key => {
                    let temp = this.props.weights_dict[key], item_name
                    item_name = temp && temp["item_name"] ? temp["item_name"] : key

                    if (sells_items[key]["order_details"])
                        page.push(<Order order={sells_items[key]["order_details"]} item_id={item_name} />)
                })
            }
            page.push(<CategoryDrawer weights_dict={this.props.weights_dict} order_drawer={true} />)
            // page.push(<AddItem weights_dict={this.props.weights_dict}/>)
            console.log(supplier["sells_items"])

        }
        return page
    }


    render() {
        // console.log(this.props.supplier)
        console.log(this.props.weights_dict)
        let supplier = this.props.supplier
        console.log(supplier)
        return (
            <div className="notification_category_container">
                <OrderHeader key={"header" + this.props.cat_type + this.props.category_id} cat_name={supplier["name"]} cat_type={this.props.cat_type} on_click={this.remove_onClick} weights_dict={this.props.weights_dict} cat_id={this.props.category_id} />
                <Collapse in={this.state.show} key={this.props.category_id + "collapse" + this.props.cat_type} >
                    {(props, ref) => <Panel {...props} ref={ref} key={this.props.category_id + " panel " + this.props.cat_type} orders={this.render_supplier(this.props.supplier)} />}
                </Collapse>
            </div>
        );
    }
}

//3
export class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log(this.props.order)
        let quantity = this.props.order["amount"],
            unit = this.props.order["unit"]
        unit = Dictionary[unit] ? Dictionary[unit] : Dictionary["unknown"]
        if (this.state) {
            return (
                <div className="order_container">
                    <div className="order_item_name">
                        {this.props.item_id}
                    </div>
                    <Quantity defult_val={quantity} unit={unit} />
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
        this.state = {
            page:[]
        }
    }
    render() {

        return (
            <div className="add_item_container" dir={getRTL()} onClick={this.props.func} >
                {"+ "} {Dictionary["new_item"]}
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
            arrow: <img src={down_arrow} alt={"arrow up"} className="order_symbol" />

        }
    }

    render() {
        return (
            <div className="order_header order_toggler" onClick={(e) => this.props.on_click(e)}  >
                <div className="order_item_name order_toggler">
                    {this.props.cat_name}
                </div>
                <div className="centerPhotos">
                    <img src={phone_icon} alt={Dictionary["phone"]} className="order_symbol" />
                    <img src={whatsapp_icon} alt={Dictionary["whatsapp"]} className="order_symbol" />
                    <img src={envelope_icon} alt={Dictionary["email"]} className="order_symbol" />


                </div>
                {this.state.arrow}
            </div>

        )
    }
}
