import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { LoginComponent } from './pages/login page/LoginPage';

export const base_url = "http://127.0.0.1:5000"


ReactDOM.render(<LoginComponent/>,document.getElementById('root'));

