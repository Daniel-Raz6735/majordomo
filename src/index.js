import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/styles/rsuite-default.css';
import './index.css';
import { SiteFrame } from './components/bars/bars';
import LoginComponent from './pages/login page/LoginPage';

var url = ""
export var wssUrl =""
url = "http://127.0.0.1:8000"
wssUrl = 'ws://localhost:8010/wsw'
url = "https://majordomo.cloudns.asia:443"
wssUrl = 'wss://majordomo.cloudns.asia/wsw'
if (window.location.href.includes("majordomo-me")) {
    wssUrl = '  wss://majordomo.cloudns.asia/wsw'
    url = "https://majordomo.cloudns.asia:443"
}


export const base_url = url

ReactDOM.render(<LoginComponent />, document.getElementById('root'));

