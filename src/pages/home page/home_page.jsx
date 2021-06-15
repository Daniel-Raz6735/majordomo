import React, { Component } from 'react';
import logo from '../../images/icons/Majordomo logo.svg';
import './home_page.css'
import { Notification, OKNotification } from '../../components/notifications'
import { category_names, category_symbols, notification_dict } from '../../components/notifications_data';
import { CategoryDrawer } from '../../components/drawer';
import { Dictionary, getTime } from '../../Dictionary';
import { getUnitById } from '../../components/data_dictionary';
import { ModalDemo } from '../../components/qr_reader';



export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: [],
            dict: props.dict
        }


    }
 
    render() {
        var notfication
        if (this.props.dict["notifications"])
            notfication = this.props.dict["notifications"]["category"]

        var tiles = this.props.dict["weights"]["category"]

        let temp = notfication ? <NotificationPeeker preferences={this.props.dict["preferences"][0]} key={"notification_peeker"} dict={notfication} /> : <OKNotification />

        return (
            <div className="home_page">
                <img alt="Majordomo logo" className="majordomoLogo" src={logo} ></img>
                {/* <NotificationPeeker dict={notfication} /> */}
                <div className="home_titles"><div>{Dictionary["notifications"]}</div>  <div>{getTime()}</div></div>
                {temp}
                <div className="home_titles"><div>Inventory Status</div>  <div>{getTime()}</div></div>
                <InentoryTileContainer key={"tile"} dict={tiles} />
                <ModalDemo dict={this.props.dict} />
            </div>

        );

    }
} export default HomePage



export class NotificationPeeker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: [],

        }

    }


    componentDidMount() {
        var page = []
        let minimum_reach = this.props.preferences["minimum_reach_alerts"]
        Object.keys(this.props.dict).forEach(level => {
            var level_dict = this.props.dict[level]
            Object.keys(level_dict).forEach(supplier_id => {
                var supplier_info = level_dict[supplier_id]
                Object.keys(supplier_info).forEach(item_id => {
                    var item_info = supplier_info[item_id]
                    if (!minimum_reach && item_info["notification_level"] === 2)
                        return

                    page.push(<Notification key={"not" + item_id} notification_level={item_info["notification_level"]}
                        item_name={item_info["item_name"]} total_weight={item_info["total_weight"]}
                        unit={getUnitById(item_info["unit"])} order_details={item_info["order_details"]}
                        item_id={item_id} supplier_id={item_info["supplier_id"]} />)
                })
            })
        })
        this.setState({ page })
    }

    render() {


        return (
            <div className="home_notification_inventory">
                {/* <div className="home_titles"><div>{Dictionary["notifications"]}</div>  <div>{getTime()}</div></div> */}
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
            page.push(<CategoryDrawer key={"cat_drawer" + i} cat_name={category_names[i]} symbol={category_symbols[i]} weights_dict={this.props.dict[i + 1]} cat_id={i} tile={true} />)
        }

        return (
            <div className="home_notification_inventory">
                {/* <div className="home_titles"><div>Inventory Status</div>  <div>{getTime()}</div></div> */}
                <div className="inventory_tile_container">

                    {page}

                </div>
            </div>
        );

    }
}

export class InventoryTile extends Component {
    //previews the inventory tilels that a click on them opens the inventory drawer
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
                    page.push(<img key={"img" + key} className="header_symbols notification_toggler" src={notification_dict[notification_num]["error_symbol"]} alt="category symbol" />)
                }
            })
        }
        this.setState({ page })
    }

    render() {

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