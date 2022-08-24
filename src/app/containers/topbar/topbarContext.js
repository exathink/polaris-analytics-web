import React from 'react';
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {useBlurClass} from "../../helpers/utility";

export default withNavigationContext(({context}) => {
  const blurClass = useBlurClass();
  const display = context.display();
  const contextStyle = {color: context.color()};
  return (
    <div className="topBarContext">
      <i className={context.icon()} style={contextStyle}/>
      {
        display ? <span style={contextStyle} className={blurClass}>{display}</span> : null
      }
    </div>
  );
});





