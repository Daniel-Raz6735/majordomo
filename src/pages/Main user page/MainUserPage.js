import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Dictionary, LangBtn } from '../../Dictionary'
import { auth } from '../../config/firebaseConfig'

class MainUserPage extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                Hello World
                <LangBtn />
                <button id="logoutBtn" onClick={() => {
                    auth.signOut()
                    window.location.reload()
                }} >{Dictionary.signOut}</button>
            </div>
        );

    }
}
export default MainUserPage