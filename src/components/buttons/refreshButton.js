import React from "react";
import {withViewerContext} from "../../app/framework/viewer/viewerContext";
import styles from "./buttons.module.css";

export const RefreshButton = withViewerContext(({viewerContext: {resetStore}}) => {
  return (
    <i title={`Refresh Data`}
       className={`${styles["menu-item"]}  ion ion-ios-refresh-empty`}
       onClick={() => resetStore()}
    />
  );
});
