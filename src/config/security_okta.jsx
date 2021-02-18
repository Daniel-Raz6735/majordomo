import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Security } from '@okta/okta-react';
import { OktaAuth,useOktaAuth } from '@okta/okta-auth-js';
import SettingPage from '../pages/SettingPage';

const config = {
        clientId: '0oa4mg79eLGUpoyUl5d6',
        issuer: 'https://dev-87311569.okta.com/oauth2/default',
        redirectUri: 'http://localhost:3000/login/callback',
        scopes: ['openid', 'profile', 'email'],
        pkce: true
};


const oktaAuth = new OktaAuth(config);

const App = () => {
  return (
    <Router>
      <Security oktaAuth={oktaAuth}>
      <Switch>
      <Route  path="/login/callback"  component={SettingPage} />
      <SecureRoute  path="/"  component={SiteFrame} />
        </Switch>
      </Security>
    </Router>
  );
};

export default App;


export const Home = () => {
    const { authState, authService } = useOktaAuth();
    const login = () => authService.login('/profile');
  
    if( authState.isPending ) {
      return (
        <div>Loading authentication...</div>
      );
    } else if( !authState.isAuthenticated ) {
      return (
        <div>
          <a onClick={login}>Login</a>
        </div>
      );
    }
  };