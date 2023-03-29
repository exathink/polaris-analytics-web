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

  let Comp;
  if (context?.selectedRoute?.topic?.ContextControl !== undefined) {
    Comp = context.selectedRoute.topic.ContextControl;
  } else {
    Comp = context.context.ContextControl;
  }

  return (
    <div className="topBarContext" data-testid="topBarContext">
      <i className={context.icon()} style={contextStyle} />
      <span className="topBarLabel">{element}</span>

      {Comp && <Comp context={context} />}
    </div>
  );
});





