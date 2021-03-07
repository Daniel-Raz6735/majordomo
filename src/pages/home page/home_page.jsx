import React, { Component } from 'react';
import logo from '../../images/icons/Majordomo logo.svg';
import './home_page.css'
import { Notification } from '../../components/notifications'





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

        return (
            <div className="home_page">
                <img alt="Majordomo logo" className="majordomoLogo" src={logo} ></img>
                <NotificationPeeker dict={notfication} />
                <InentoryTileContainer />
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
        console.log(this.props.dict)
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

        let temp = Date.now()
        let now = new Date(temp)
        let date = now.getDate()
        let months = now.getMonth() + 1
        let year = now.getFullYear()

        let date_str = date + "." + months + "." + year



        return (
            <div>
                <div className="home_titles"><div>Notifications</div>  <div>{date_str}</div></div>
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
        let temp = Date.now()
        let now = new Date(temp)
        let date = now.getDate()
        let months = now.getMonth() + 1
        let year = now.getFullYear()
        let date_str = date + "." + months + "." + year

        for (let i = 0; i < 6; i++) {
            page.push(<InventoryTile name={"fruit"} />)
        }

        return (
            <div>
                <div className="home_titles"><div>Inventory</div>  <div>{date_str}</div></div>
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

        }

    }


    componentDidMount() {

    }

    render() {

        return (

            <div className="inventory_tile">

                {this.props.name} זה טייל
            </div>
        );

    }
}