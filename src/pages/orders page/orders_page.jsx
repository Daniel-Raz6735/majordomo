import React, { Component } from "react";
import { ButtonsComponent, refresh, TitleComponent } from "../../components/bars/bars.jsx";
import { Animation, Button, Divider } from 'rsuite';
import whatsapp_icon from '../../images/icons/contact/whatsapp.svg';
import phone_icon from '../../images/icons/contact/phone.svg';
import envelope_icon from '../../images/icons/contact/envelope.svg';
import down_arrow from '../../images/icons/arrows/down_arrow.svg';
import $ from 'jquery'
import './orders_page.css'
import { Dictionary, getRTL } from "../../Dictionary";
import { CategoryDrawer, SearchBar } from "../../components/drawer";
import { Quantity } from "../inventory page/inventory_page";
import { base_url } from "../../index.js";
import right_arrow from '../../images/icons/arrows/right_arrow.svg'
import { getUnitById } from "../../components/data_dictionary.js";



var headers = {
    supplier: 'Supplier'.replace(/,/g, ''), // remove commas to avoid errors
    item: "Item",
    amount: "Amount",
    unit: "Unit"

};


var fileTitle = 'orders'; // or 'my-unique-title'

var sellers = []


const { Collapse } = Animation;

export function sort_by_key_val(jsObj, sort_by_key, reverse) {
    //sort an array of key and value [key,val]
    var sortedArray = []
    Object.keys(jsObj).forEach(key => {
        // Push each JSON Object entry in array by [value, key]
        if (sort_by_key)
            sortedArray.push([jsObj[key], key]);
        else
            sortedArray.push([key, jsObj[key]]);
    })
    sortedArray.sort()
    if (reverse)
        sortedArray.reverse()
    return sortedArray;
}

export var items = {}


//1
export class OrdersPage extends Component {
    //this component will get a dictionary with one seller and will make a list out of it. 
    constructor(props) {
        super(props);
        this.state = {
            page: [],
            dict: props.dict,
            export: false,
            weight_sup_dict: null,
            sorted_sellers: null,
            term: ""

        }
        this.sort_dict = this.sort_dict.bind(this);
        this.call_back = this.call_back.bind(this);
        this.sort_by_supplier = this.sort_by_supplier.bind(this);
        this.export_list = this.export_list.bind(this);
        this.back_to_list = this.back_to_list.bind(this);
        this.handle_change = this.handle_change.bind(this);


    }

    handle_change(term) {
        // console.log(e)
        this.setState({ term })
    }

    call_back(toggle_number) {

    }

    export_list() {
        this.setState({ export: true })
    }

    back_to_list() {

        this.setState({ export: false })
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

            return page;

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

            if (suppliers_dict) {

                Object.keys(suppliers_dict).forEach(key => {

                    if (orders_dict && orders_dict[key])
                        sellers[key] = Object.keys(orders_dict[key]).length
                    else
                        sellers[key] = 0
                })
                var sorted_sellers = sort_by_key_val(sellers, false, true)
                var weight_sup_dict = dict["weights"]["supplier"]

                sorted_sellers.forEach(supplier => {

                    var supplier_id = supplier[0]
                    let term = this.state.term
                    page.push(<OrderCategory key={"order_cat" + supplier + this.props.update + this.state.term} term={term} weights_dict={weight_sup_dict[supplier_id]} supplier={suppliers_dict[supplier_id]} />)
                })

            }
        }
        return page
    }
    render_supplier(supplier) {
        if (supplier) {
            var sells_items = supplier["sells_items"]
            if (sells_items) {
                Object.keys(sells_items).forEach(key => {
                    if (sells_items[key]["order_details"]) {

                    }
                })
            }


        }
    }


    render() {
        var page = this.sort_dict(1)

        if (!this.state.export)
            return (
                <div className="orders_page_container">
                    <TitleComponent key={"tile_comp"} title_name="lists" />
                    <ButtonsComponent key="Order_btns" def_btn={1} btn_names={["item_type", "supplier"]} orders={true} export_func={this.export_list} callback={this.sort_dict} />
                    <SearchBar handleChange={this.handle_change} key={"search_bar_order_page"} />
                    {page}
                </div>

            );
        else
            return (<OrderList items={items} back_to_list={this.back_to_list} />)

    }
} export default OrdersPage


//2
class OrderCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: [],
            show: true,
            num_of_obj: 0

        };

        this.remove_onClick = this.remove_onClick.bind(this);
        this.render_supplier = this.render_supplier.bind(this);

    }
    componentDidMount() {

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

            if (sells_items && Object.keys(sells_items).length > 0) {
                Object.keys(sells_items).forEach(key => {
                    let temp = this.props.weights_dict && this.props.weights_dict[key] ? this.props.weights_dict[key] : null, item_name, orders_details
                    item_name = temp && temp["item_name"] ? temp["item_name"] : key
                    orders_details = sells_items[key]["order_details"]

                    if (orders_details) {
                        // add orders that answer to serach input
                        if (this.props.term && this.props.term.length > 0 && item_name.toLowerCase().startsWith(this.props.term.toLowerCase()))
                            page.push(<Order key={"order" + key + this.props.term} supplier_name={this.props.supplier["name"]} order={orders_details} item_name={item_name} item_id={key} order_id={orders_details["order_id"]} />)
                        else if (this.props.term.length === 0)
                            page.push(<Order key={"order" + key} supplier_name={this.props.supplier["name"]} order={orders_details} item_name={item_name} item_id={key} order_id={orders_details["order_id"]} />)

                    }
                })
            }
            page.push(<CategoryDrawer key={"cat_drawer_order_page"} weights_dict={this.props.weights_dict} order_drawer={true} />)
            // page.push(<AddItem weights_dict={this.props.weights_dict}/>)

        }
        return page
    }


    render() {

        let supplier = this.props.supplier
        var orders = this.render_supplier(this.props.supplier)


        if (!this.props.term || (this.props.term && this.props.term.length > 0 && orders.length - 1 > 0)) {

            return (
                <div className="notification_category_container">
                    <OrderHeader key={"header" + this.props.cat_type + this.props.category_id} cat_name={supplier["name"]} cat_type={this.props.cat_type} on_click={this.remove_onClick} weights_dict={this.props.weights_dict} cat_id={this.props.category_id} />
                    <Collapse in={this.state.show} key={this.props.category_id + "collapse" + this.props.cat_type} >
                        {(props, ref) => <Panel {...props} ref={ref} key={this.props.category_id + " panel " + this.props.cat_type} orders={this.render_supplier(this.props.supplier)} />}
                    </Collapse>
                </div>
            );
        } else
            return <div></div>
    }
}

//3
class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quantity: props.order["amount"],
            incraments: props.incraments ? props.incraments : 1,
            min: 1,
            max: 99,
            delete_btn: "",
            business_id: this.props.business_id ? this.props.business_id : 1

        }
        this.handlePlus = this.handlePlus.bind(this);
        this.handleMinus = this.handleMinus.bind(this);
        this.handleButtonPress = this.handleButtonPress.bind(this)
        this.handleButtonRelease = this.handleButtonRelease.bind(this)
        this.removeItem = this.removeItem.bind(this)
    }



    handleMinus() {
        var new_val = this.state.quantity - this.state.incraments;

        if (new_val >= this.state.min)
            this.setState({ quantity: new_val });
        else
            alert("enterd to little")
    }

    handlePlus() {
        var new_val = this.state.quantity + this.state.incraments;

        if (new_val <= this.state.max)
            this.setState({ quantity: new_val });
        else
            alert("enterd to much")
    }

    handleButtonPress() {
        this.buttonPressTimer = setTimeout(() => this.setState({ delete_btn: <button onClick={this.removeItem} className="delete_order_btn" >Delete</button> }), 500);
    }

    handleButtonRelease() {
        clearTimeout(this.buttonPressTimer);
    }

    removeItem() {
        let req = base_url + "/order/remove/item" + "?order_id=" + this.props.order_id + "&item_id=" + this.props.item_id + "&business_id=" + this.state.business_id


        $.ajax({
            url: req,
            type: "DELETE",
            success: function (res) {
                refresh()

            },
            error: function (err) {
                console.log(err)
            }
        });
    }


    render() {
        let quantity = null, unit = null
        if (this.props.order) {
            quantity = this.props.order["amount"]
            unit = this.props.order["unit"]
        }

        // fill the items var with the relevent orders to show on export list
        let obj = { "item_name": this.props.item_name, "quantity": this.state.quantity, "unit": getUnitById(this.props.order["unit"]) }
        if (!items[this.props.supplier_name])
            items[this.props.supplier_name] = [obj]
        else {

            let inList = false
            for (let i = 0; i < items[this.props.supplier_name].length; i++)
                // case that the item was increment or decrement.    
                if (items[this.props.supplier_name][i].item_name === obj.item_name) {
                    inList = true
                    items[this.props.supplier_name][i] = obj
                }
            if (!inList)
                items[this.props.supplier_name].push(obj)
        }


        if (this.state) {
            return (
                <div className="order_container"
                    onTouchStart={this.handleButtonPress}
                    onTouchEnd={this.handleButtonRelease}
                    onMouseDown={this.handleButtonPress}
                    onMouseUp={this.handleButtonRelease}
                    onMouseLeave={this.handleButtonRelease} >
                    <div className="order_item_name">
                        {this.props.item_name}
                    </div>
                    <Quantity handlePlus={this.handlePlus} handleMinus={this.handleMinus} defult_val={quantity} value={this.state.quantity} unit={unit} />
                    {this.state.delete_btn}
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
            page: []
        }
    }



    render() {

        return (
            <div className="add_item_container" dir={getRTL()} onClick={this.props.func} >
                <div className="order_page_plus_symbol" >+</div>  {Dictionary["new_item"]}
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
        let clas = this.props.export_list ? "list_header order_toggler" : "order_header order_toggler"
        let checkbox = this.props.export_list ? <div ><input onChange={() => this.props.func(this.props.cat_name)} style={{ width: "30px", height: "30px" }} type="checkbox" /></div> : ""


        return (
            <div className={clas} onClick={(e) => this.props.on_click(e)}  >
                {checkbox}
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



//1
class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: [],
            show: true

        }

        this.add_seller = this.add_seller.bind(this);
        this.confirm_all = this.confirm_all.bind(this);
        this.confirm_seller = this.confirm_seller.bind(this);
    }



    componentDidMount() {
        console.log(items)
        let page = []
        Object.keys(items).forEach(seller => {
            page.push(<OrderListCategory confirm_seller={this.confirm_seller} func={this.add_seller} key={"list_cat" + seller} seller={seller} />)
        })
        this.setState({ page })

    }


    componentWillUnmount() {
        sellers = []
    }


    add_seller(seller) {
        if (sellers) {
            if (!sellers.includes(seller))
                sellers.push(seller)
            else
                sellers.splice(sellers.indexOf(seller), 1)
        }

    }

    confirm_all() {
        console.log(items)
        console.log(sellers)


        var itemsList = []

        sellers.forEach(seller => {
            items[seller].forEach(item => {
                itemsList.push({ supplier: seller, item: item.item_name, amount: item.quantity, unit: item.unit })
            })
        })

        // var itemsFormatted = [];

        // // format the data
        // itemsNotFormatted.forEach((item) => {
        //     itemsFormatted.push({
        //         supplier: item.supplier.replace(/,/g, ''), // remove commas to avoid errors,
        //         order: item.order,

        //     });
        // });

        if (itemsList.length > 0)
            exportCSVFile(headers, itemsList, fileTitle)


    }

    confirm_seller(seller) {
        console.log(seller)



        var itemsList = []

        this.props.items[seller].forEach(item => {
            itemsList.push({ supplier: seller, item: item.item_name, amount: item.quantity, unit: item.unit })
        })

        if (itemsList.length > 0)
            exportCSVFile(headers, itemsList, fileTitle)
    }

    render() {

        return (
            <div className="export_list" >
                <TitleComponent key={"title_list_comp"} title_name={"export_lists"} />
                <div style={{ float: "right" }}>Lists <img src={right_arrow} alt="back" onClick={this.props.back_to_list} /></div>
                <div className="confirm_all_btn"><Button onClick={this.confirm_all} style={{ color: "white", background: "#73D504" }}>Confirm all</Button></div>
                {this.state.page}
            </div>
        )
    }
}


//2
class OrderListCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: [],
            show: true

        }

        this.remove_onClick = this.remove_onClick.bind(this)
    }

    componentDidMount() {
        let page = []

        for (let i = 0; i < items[this.props.seller].length; i++)
            page.push(<OrderListItems item_name={items[this.props.seller][i].item_name} quantity={items[this.props.seller][i].quantity} unit={items[this.props.seller][i].unit} />)

        page.push(<div className="confirm_seller_button" ><Button onClick={() => this.props.confirm_seller(this.props.seller)} style={{ color: "white", background: "#73D504" }}>Confirm</Button></div>)

        this.setState({ page })
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

    render() {

        let divider = this.state.show ? <Divider vertical={false} /> : ""

        return (<div className="list_category_container ">
            <OrderHeader export_list={true} cat_name={this.props.seller} func={this.props.func} on_click={this.remove_onClick} />
            {divider}
            <Collapse key={"list_col" + this.props.seller} in={this.state.show}  >
                {(props, ref) => <Panel key={"list_panel" + this.props.seller} {...props} ref={ref} orders={this.state.page} />}
            </Collapse>

        </div>)
    }
}


//3
class OrderListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {


        }
    }

    render() {
        // reset items on list
        // items = {}

        return (
            <div className="order_list_items">
                <div>{this.props.item_name}</div>
                <div>{this.props.quantity} {" "} {this.props.unit}</div>
            </div>)
    }
}

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, data, fileTitle) {
    if (headers) {
        data.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(data);


    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


