import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './LoginPage.css';
import $ from 'jquery';
import { auth } from '../../config/firebaseConfig';
import {Dictionary, LangBtn} from '../../Dictionary';
import { SiteFrame } from '../../components/bars';
import logo from '../../images/icons/Majordomo logo.svg'

require('jquery-validation');



class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: {},
            password: {},
        }
    }

    login(e) {
        e.preventDefault();
        $("#login_form").validate({
            // Specify validation rules
            rules: {
                email: {
                    required: true,
                    minlength: 1,
                    email: true,
                },
                password: {
                    required: true,
                    minlength: 1,
                },
            },
            messages:{ }
        });

        if (!$("#login_form").valid()) return;
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            window.location.reload();
        }).catch(function (error) {
            // alert(errorCode + " : " + errorMessage);
            $("#password").val("");
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div id="LPcover" className="cover">
                <div id="loginWrapper" className="wrapper">
                    <div className="loginContainer">
                        <div id="buttonWrapper123">
                        <img src ={logo} alt ="logo"></img>
                            <form dir="RTL" id="login_form" name="login_form_name" >
                                < input type="email"
                                    id="email"
                                    name="email"
                                    placeholder={Dictionary.enterMail}
                                    autoComplete='off'
                                    defaultValue="" required
                                    onChange={this.handleChange}>
                                </input>
                                < input type="password"
                                    id="password"
                                    name="password"
                                    placeholder={Dictionary.enterPass}
                                    autoComplete='off'
                                    defaultValue="" required
                                    onChange={this.handleChange}
                                >
                                </input>
                                <button id="loginbtn"
                                    type="submit"
                                    text={Dictionary.login}
                                    className="btn btn-success"
                                    onClick={this.login} >
                                    {Dictionary.login}
                                </button>
                            </form>
                        </div>
                      
                    </div>
                </div>
            </div>
        )
    }
}




class LoginComponent extends Component {
// this class contains the basic rendering for the site 
    constructor(props) {
        super(props);
        this.state = {
            user: false,
            page: [],
            permission: false,
        }
    }
    
    authListener() {
        auth.onAuthStateChanged((user) => {
            if (user) 
                this.setState({ user });
            else 
                this.setState({ user: false });
        })
    }

    signOutFun() {
        auth.signOut();
    }
    
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            var comp=[]
            if (user){
                comp = <Router>
                     <Route path="/"  component={SiteFrame} />
                    </Router>
            }
            else{
                comp = <LoginPage/>
            }
            this.setState({page:comp})
        })
    }
    render() {
        return <div id="renderDiv"> {this.state.page}</div>
    }
}
export default LoginComponent;