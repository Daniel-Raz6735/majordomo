import React, { Component } from 'react';
import logo from '../../images/icons/Majordomo logo.svg';
import './home_page.css'




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
       
        return (
           <div className="home_page">
               <img alt="Majordomo logo" className="majordomoLogo" src={logo} ></img>
               <NotificationPeeker/>
               <InentoryTileContainer/>
           </div>

        );

    }
} export default HomePage



export class NotificationPeeker extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }


    componentDidMount() {

    }

    render() {

        return (
            <div className="notification_peeker">
        פה יהיו כל הנוטיפיקציות האחרונות
               
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
        var page=[]
        for( let i=0;i<6;i++){
            page.push(<InventoryTile name = {"fruit"}/>)
        }

        return (
            <div className="inventory_tile_container">
                {page}
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