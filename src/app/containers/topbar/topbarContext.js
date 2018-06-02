import React from 'react';
import {withNavigation} from "../../framework/navigation/context/withNavigation";

const topBar = (props) => {
  const {navigation} = props;
  const currentContext = navigation.current();
  if (currentContext) {
    const display = currentContext.display();
    const contextStyle = {color: currentContext.color()};

    return (
        <div className="topBarContext">
          <i className={currentContext.icon()} style={contextStyle} />
          {
            display ? <span style={contextStyle}>{display}</span> : null
          }
        </div>
    );
  } else {
    return null;
  }
};

export default withNavigation(topBar);



