import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './LoginPage.css';
import $ from 'jquery';
import { auth } from '../../config/firebaseConfig';
import MainUserPage from '../Main user page/MainUserPage'
import { validate } from 'jquery-validation';
// require('jquery-validation');



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
            messages: {}
        });

        if (!$("#login_form").valid()) return;
        auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            window.location.reload();
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode + " : " + errorMessage);
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
                            <form dir="RTL" id="login_form" name="login_form_name" role="form">
                                < input type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter email"
                                    autoComplete='off'
                                    defaultValue="" required
                                    onChange={this.handleChange}>
                                </input>
                                <a>‏ </a>
                                < input type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter password"
                                    autoComplete='off'
                                    defaultValue="" required
                                    onChange={this.handleChange}
                                >
                                </input>
                                <button id="loginbtn"
                                    type="submit"
                                    text="login"
                                    className="btn btn-success"
                                    onClick={this.login} >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default LoginPage;



export class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: false,
            page: [],
            permission: false,
        }

    }

    // authListener() {
    //     auth.onAuthStateChanged((user) => {
    //         if (user) this.setState({ user });
    //         else this.setState({ user: false });
    //         console.log(user)
    //     })
    // }

    // signOutFun() {
    //     auth.signOut();
    // }
    timeRefresh() {
        //reset page to main page if page is inactive for a half an hour
        var time = new Date().getTime();
        $(document.body).bind("mousemove keypress touchmove ", function () {
            time = new Date().getTime();
        });

        setInterval(function () {
            if ((new Date().getTime() - time >= 180000)) {
                window.location.href = "/";
            }
        }, 1000);
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            console.log(user)
            if (user){
                this.renderAdminDiv(user)
            }
            else
            this.setState({page:<LoginPage/>})
        })

    }

    renderAdminDiv(user) {
        
       
        ReactDOM.render(
            <Router>
                {/* <Route exact path="/" component={() => <AdminPage Admin={this.state.permission} />} />
                <Route path="/WomanPage/:id" component={props => <WomanPage {...props} Admin={this.state.permission} />} />
                <Route path="/Category" component={() => <Category Admin={this.state.permission} />} /> */}
                <Route exect path="/" component={() => <MainUserPage Admin={this.state.permission} />}/>
            </Router>, document.getElementById('root')
        );
    }

    renderVisitorDiv(user) {
        this.timeRefresh();
        ReactDOM.render(
            <Router>
                <Route exact path="/" component={MainUserPage} />
                {/* <Route path="/WomanPage/:id" component={props => <WomanPage {...props} />} />
                <Route path="/Category" component={Category} /> */}
            </Router>, document.getElementById('root')
        );
    }

    render() {

        return <div id="renderDiv"> {this.state.page}</div>

    }
}