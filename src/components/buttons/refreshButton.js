import React from "react";
import {ReloadOutlined} from "@ant-design/icons";
import {withViewerContext} from "../../app/framework/viewer/viewerContext";
import styles from "./buttons.module.css";

export const RefreshButton = withViewerContext(({viewerContext: {resetStore}}) => {
  return (
    <ReloadOutlined title="Refresh Page" className={`${styles["menu-item"]} ${styles.reload}`} onClick={resetStore} />
  );
});
