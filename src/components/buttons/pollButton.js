import React from "react";
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";
import styles from "./buttons.module.css"

export const PollButton = withNavigationContext((props) => {
  const {polling, setPolling} = props;
  const buttonClass = !polling  ? 'toggleOff' : '';
  return(
    <i title={`Live updates ${polling? 'enabled' : 'disabled'}`}
       className={`${styles["menu-item"]} ${buttonClass} ion ion-ios-pulse`}
       onClick={() => setPolling(!polling)}
    />
  );
});


