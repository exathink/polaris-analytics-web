import React from 'react';
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";

export default withNavigationContext(({context}) => {
  const display = context.display();
  const contextStyle = {color: context.color()};
  return (
    <div className="topBarContext">
      <i className={context.icon()} style={contextStyle}/>
      {
        display ? <span style={contextStyle}>{display}</span> : null
      }
    </div>
  );
});





