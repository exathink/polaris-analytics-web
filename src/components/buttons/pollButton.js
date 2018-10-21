import React from "react";
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";

export const PollButton = withNavigationContext((props) => {
  const {polling, setPolling} = props;
  const buttonClass = !polling  ? 'toggleOff' : '';
  return(
    <i title={`Live updates ${polling? 'enabled' : 'disabled'}`}
       className={`menu-item ${buttonClass} ion ion-ios-pulse`}
       onClick={() => setPolling(!polling)}
    />
  );
});


