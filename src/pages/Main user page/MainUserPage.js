import React, { Component } from 'react';
import { Dictionary, LangBtn } from '../../Dictionary'
import { auth } from '../../config/firebaseConfig'
import './MainUserPage.css'
import $, { data } from 'jquery';
import {Notification_block} from "../../components/notifications"
import {Item_block, Container} from "../../components/containers"
import {BottomBar, Nav_bar} from "../../components/bars"
import ReactDOM from 'react-dom';

import cart_plus from '../../images/icons/cart_plus.svg'
import logo from '../../images/icons/Majordomo logo.svg'
import {base_url} from '../../index'
import { render_container, req_weights } from '../../components/containers';



class MainUserPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: [],

        }

    }


    componentDidMount(){
     

    // req_weights(render_container,1)

    }

    render() {
        return (
            <div className="main_user_page_container">
                <Nav_bar/>
                
                <div className="main_info_container" >
                <Notification_block/>
                </div>
                <BottomBar />
       
            </div>
          
        );

    }
}
export default MainUserPage

