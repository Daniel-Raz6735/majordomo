import React, { Component } from "react";
import './settings_page.css'

class OrdersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sellers: [],
            page: []

        }

    }
    componentDidMount() {
        var page = []
        var fake_seller = {
            "supplier_id":
            {
                "business_id": {
                    "item_id":{
                        days_to_provide: "1011010" , // 7 numbers. for seven days. 1 for sending 0 if not
                        frequency: "daily", 
                        preferred_contact: "email"
                    }
                   




                }
            }
        }

//         item_id int FK >- food_items.item_id
// order_id int FK >- orders.order_id
// price_per_unit real null
// amount int null
// unit varchar(2)

// order_id int PK
// order_date timestamp
// order_creator_id int FK >- users.user_id
// business_id int FK >- business.business_id
// supplier_id int FK >- supplier.supplier_id
// price real Null
        var fake_order= {
            "supplier_id":
            {
                "item_id": {
                    "item_name": "cucamber" ,  
                    "unit":"kg"

                }
            }
        }

        fake_seller.array.forEach(element => {

        });
    }
    render_sellers(seller_dict) {

    }

    render() {

        return (
            <div id="orders_page_container">
                <OrderList />
            </div>

        );

    }
}
export default OrdersPage

export class OrderList extends Component {
    //this component will get a dictionary with one seller and will make a list out of it. 
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div id="orders_page_container">
                this is the orders area
            </div>

        );

    }
}
