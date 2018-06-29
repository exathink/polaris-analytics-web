import React, { PureComponent } from 'react';
import { LOGOUT_URL } from '../../../config/url';

class Logout extends PureComponent {
  componentDidMount() {
    document.getElementById('logout-form').submit();
  }

  render() {
    return (
      <form id="logout-form" action={LOGOUT_URL} method="post">
        <input type="hidden" name="resource" value={window.location.origin + '/'} />
      </form>
    );
  }

}

export default Logout;
