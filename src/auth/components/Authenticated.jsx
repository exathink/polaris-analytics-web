import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { checkAuth } from '../helpers';

export default SecuredComponent => {
  const Authenticated = props => (
      checkAuth()
      ? <SecuredComponent {...props} />
      : <Redirect to={"/login?from="+window.location.href} />
  );

  return withRouter(Authenticated);
}
