import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Switch, Route, withRouter, } from 'react-router-dom';
import './App.css';
import firebase from './firebase/config';
import { AuthContext } from './context/authContext';
import { getUsernameFromDatabase } from './firebase/utility';

import PrivateRoute from './hoc/PrivateRoute';
import LandingPage from './pages/Landing/Landing';
import AppLayout from './layout/AppLayout';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const App = props => {
  const { history } = props;
  const { currentUser } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      getUsernameFromDatabase(currentUser.uid)
        .then(usr => {
          console.log(usr);
          setUserName(usr);
          setIsAuthenticated(true);
          history.push('/app');
        })
        .catch(err => console.log(err));
    } else {
      console.log('user not signed in');
    }
  }, [currentUser, history]);

  const handleSignOut = useCallback(async () => {
    try {
      await firebase.auth().signOut();
      setIsAuthenticated(false);
      setUserName('');
      alert('Signed out successfully!');
      history.push('/');
    } catch (err) {
      console.log(err);
    }
  }, [history]);

  return (
    <Switch>
      <Route path='/' exact render={props => <LandingPage isAuthenticated={isAuthenticated} />} />
      <Route path='/login' exact render={props => <Login {...props} />} />
      <Route path='/register' exact render={props => <Register {...props} />} />
      <PrivateRoute component={AppLayout} path='/app' username={userName} handleSignOut={handleSignOut} />
    </Switch>
  );
}

export default withRouter(App);
