import React from 'react';
import IntlMessages from '../../../components/utility/intlMessages';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

const topBar = (props) => {
  const {navigation} = props;
  if(navigation.length > 0) {
      const currentContext = navigation[0];
      return (
        <h3>
          <span className="nav-text">
            <IntlMessages id={`context.${currentContext.name()}`}/>
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



