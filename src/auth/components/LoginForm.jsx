import React from 'react';

// move to config per env, cabeza !!
const ACTION = "http://polaris-services.exathink.localdev:8000/?sso"

export default ({ resource }) => (
  <form id="login-form" action={ACTION} method="post">
    <input type="hidden" name="resource" value={resource} />
  </form>
);
