import React from 'react';
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";
import {useBlurClass} from "../../helpers/utility";

export default withNavigationContext(({context}) => {
  const blurClass = useBlurClass();
  const display = context.display();
  const contextStyle = {color: context.color()};

  let element;
  if (blurClass) {
    const [_title] = display?.props?.defaultMessage?.split?.(":") ?? [];
    const _val = display?.props?.values?.instance;
    element = (
      <React.Fragment>
        <span style={contextStyle}>{_title}</span>
        {_val ? ":": ""}
        <span className={blurClass}>{_val}</span>
      </React.Fragment>
    );
  } else {
    element = display ? (
      <span style={contextStyle}>
        {display}
      </span>
    ) : null;
  }

  return (
    <div className="topBarContext" data-testid="topBarContext">
      <i className={context.icon()} style={contextStyle}/>
      {
        element
      }
    </div>
  );
});





