import React from 'react';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

const topBar = (props) => {
  const {navigation} = props;
  if(navigation.length > 0) {
      const currentContext = navigation[0];
      return (
        <h3>
          <span className="nav-text">
            {currentContext.display()}
          </span>
        </h3>
      );
  } else {
      return null;
  }
};

export default withRouter(connect(
  state => ({
      navigation: state.navigation.toJS()
  })
)(topBar));



