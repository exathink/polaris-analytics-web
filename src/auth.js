import React, {PureComponent} from 'react';
import {Route, Redirect} from "react-router-dom";
import  * as axios from 'axios';
import {connect} from 'react-redux';

import {checkAuth, getCookie} from "./utils";
import {store} from './redux/store';


const mapAuthPropsFromState = state => ({
    auth_state: state.auth_state,
    user_info : state.user_info
});

export const _PrivateRoute = ({ component: Component, auth_state, user_info, ...rest }) => {
    console.log('auth_state' + auth_state);
    return <Route
        {...rest}
        render={
            props => {
                switch (auth_state) {
                    case 'authorized': {
                        /* Inject the user and account into the protected component */
                        props = {...props, ...user_info};
                        return <Component {...props} />
                    }
                    case 'unauthorized': {
                        return <Redirect
                            to={{
                                pathname: "/logout"
                            }}
                        />
                    }
                    default: {
                        return <Redirect
                            to={{
                                pathname: "/login",
                                state: {from: props.location}
                            }}
                        />
                    }
                }
            }
        }
    />
};
export const PrivateRoute = connect(mapAuthPropsFromState) (_PrivateRoute);


const LOGIN = "http://polaris-services.exathink.localdev:8000/?sso";
const LOGOUT = "http://polaris-services.exathink.localdev:8000/?slo";
const GET_USER_CONFIG = "http://polaris-services.exathink.localdev:8100/user-config/";

export class LoginForm extends PureComponent {
    componentDidMount() {
        document.getElementById('login-form').submit();
    }

    render() {
        return (
            <form id="login-form" action={LOGIN} method="post">
                <input type="hidden" name="resource" value={this.props.resource} />
            </form>
        );
    }
}

export class Logout extends PureComponent {
    componentDidMount() {
        document.getElementById('logout-form').submit();
    }

    render() {
        return (
            <form id="logout-form" action={LOGOUT} method="post">
                <input type="hidden" name="resource" value={window.location.origin + "/app"} />
            </form>
        );
    }
}


class _Login extends React.Component {
    componentDidMount() {
        console.log('Login: Component did mount');
        if (checkAuth()){
            this.fetchUserConfigAsync()
        }
    }


    fetchUserConfigAsync() {
        axios({
            method: 'get',
            url: GET_USER_CONFIG,
            withCredentials: true,
            headers: {
                'X-XSRF-TOKEN': getCookie('session_key')
            }
        }).then((response) => {
            if (response.data) {
                store.dispatch({
                    type: 'AUTH_SUCCESS',
                    payload: response.data.data
                });
            }
        }).catch((error) => {
            console.log("User resolution failed: " + error);
            store.dispatch({
                type: 'AUTH_FAILED'
            });
        });
    }




    render() {
        console.log("Login: render");
        const { from } = this.props.location.state || { from: { pathname: "/" } };

        if (this.props.auth_state === 'authorized') {
            return <Redirect to={from} />;
        } else if (!checkAuth()) {
            return <LoginForm resource={window.location.origin + from.pathname}/>
        } else {
            return null;
        }
    }
}
export const Login = connect(mapAuthPropsFromState)(_Login);