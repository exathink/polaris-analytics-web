import React, { PureComponent } from 'react';
import { LOGIN_URL } from '../../../config/auth';

class Login extends PureComponent {
  componentDidMount() {
    document.getElementById('login-form').submit();
  }

  render() {
    return (
      <form id="login-form" action={LOGIN_URL} method="post">
        <input type="hidden" name="resource" value=
          {
            window.location.origin + (this.props.location.from || '/')
          }
        />
      </form>
    );
  }

}

export default Login;
