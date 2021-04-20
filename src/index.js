import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rsuite/dist/styles/rsuite-default.css'
// import 'rsuite/lib/styles/index.less';
import './index.css';
import LoginComponent from './pages/login page/LoginPage';

var url = ""

if (sessionStorage.getItem("developer") && !window.location.href.includes("majordomo.cloudns.asia"))
    url = "http://127.0.0.1:8000"
    url = "https://majordomo.cloudns.asia:443"
export const base_url = url

ReactDOM.render(<LoginComponent />, document.getElementById('root'));

