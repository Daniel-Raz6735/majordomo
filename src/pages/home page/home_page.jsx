import React, { Component } from 'react';
import logo from '../../images/icons/Majordomo logo.svg';
import './home_page.css'
import { Notification } from '../../components/notifications'
import { category_names, category_symbols, notification_dict } from '../../components/notifications_data';
import { CategoryDrawer } from '../../components/drawer';
import { getTime } from '../../Dictionary';





export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: [],
            dict: props.dict
        }


    }
    componentDidMount() {

    }



    render() {
        var notfication = this.props.dict["notifications"]["category"]
        var tiles = this.props.dict["weights"]["category"]


        return (
            <div className="home_page">
                <img alt="Majordomo logo" className="majordomoLogo" src={logo} ></img>
                <NotificationPeeker dict={notfication} />
                <InentoryTileContainer dict={tiles} />
            </div>

        );

    }
} export default HomePage



export class NotificationPeeker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: []
        }

    }


    componentDidMount() {
        var page = []

        Object.keys(this.props.dict).forEach(cat => {
            var temp = this.props.dict[cat]
            Object.keys(temp).forEach(key => {
                var obj = temp[key]
                Object.keys(obj).forEach(key2 => {
                    var obj2 = obj[key2]
                    page.push(<Notification notification_level={obj2["notification_level"]} item_name={obj2["item_name"]} total_weight={obj2["total_weight"]} unit={obj2["unit"]} order_details={obj2["order_details"]} />)
                })
            })
        })
        this.setState({ page })
    }

    render() {

    
        return (
            <div className="home_notification_inventory">
                <div className="home_titles"><div>Notifications</div>  <div>{getTime()}</div></div>
                <div className="notification_peeker">
                    {this.state.page}
                </div>
            </div>
        );

    }
}
export class InentoryTileContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }


    componentDidMount() {

    }

    render() {
        var page = []

        for (let i = 0; i < category_symbols.length; i++) {
            page.push(<CategoryDrawer cat_name={category_names[i]} symbol={category_symbols[i]} weights_dict={this.props.dict[i + 1]} cat_id={i} tile={true} />)
        }

        return (
            <div className="home_notification_inventory">
                <div className="home_titles"><div>Inventory</div>  <div>{getTime()}</div></div>
                <div className="inventory_tile_container">

                    {page}

                </div>
            </div>
        );

    }
}

export class InventoryTile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: []
        }

    }


    componentDidMount() {
        let dict = this.props.weights_dict
        let temp = -999
        let page = []

        if (dict) {
            Object.keys(dict).forEach(key => {
                let notification_num = dict[key]["notification_level"]
                if (notification_num !== -1 && temp !== notification_num) {
                    temp = notification_num
                    page.push(<img className="header_symbols notification_toggler" src={notification_dict[notification_num]["error_symbol"]} alt="category symbol" />)
                }
            })
        }
        this.setState({ page })
    }

    render() {
        console.log(this.props.weights_dict)


        let func, background

        if (this.props.weights_dict) {
            func = this.props.func
            background = ""
        }
        else
            background = "rgb(190, 190, 190)"


        return (

            <div className="inventory_tile" onClick={func} style={{ background: background }}>
                <div className="home_page_cat_alerts">{this.state.page}</div>
                <img className="category_home_img" src={this.props.symbol} alt="category symbol" />
                <div style={{ color: this.props.cat_color }}>{this.props.name} </div>

            </div>
        );

    }
}