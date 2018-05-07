import React from 'react';
import Icons from "../../helpers/icons";
import {withNavigation} from "../../navigation/withNavigation";

const topBar = (props) => {
  const {navigation} = props;
  if (navigation.length > 0) {
    const currentContext = navigation[0][0];
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

export default withNavigation(topBar);



