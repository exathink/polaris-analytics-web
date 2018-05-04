import React from 'react';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Icons from "../../helpers/icons";

const topBar = (props) => {
  const {navigation} = props;
  if (navigation.length > 0) {
    const currentContext = navigation[0];
    const display = currentContext.display();
    const contextStyle = {color: currentContext.color()};

    return (
        <div className="topBarContext">
          <i className={Icons.contexts[currentContext.name()]} style={contextStyle} />
          {
            display ? <span style={contextStyle}>{display}</span> : null
          }
        </div>
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



