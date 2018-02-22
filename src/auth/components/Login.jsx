import LoginForm from './LoginForm';
import React, { PureComponent } from 'react';
import { parse as parseSearch } from 'query-string';

class Login extends PureComponent {
  componentDidMount() {
    document.getElementById('login-form').submit();
  }

  render() {
    return (
      <LoginForm
        resource={
          parseSearch(this.props.location.search).from
        }
      />
    );
  }
}

export default Login;
