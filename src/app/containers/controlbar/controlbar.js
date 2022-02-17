import React from "react";
import NavigationControls from "../../framework/navigation/components/navigationControls";
import FullscreenBtn from "../../../components/buttons/FullscreenBtn";
import {PollButton} from "../../../components/buttons/pollButton";
import styles from "./controlbar.module.css";
import {RefreshButton} from "../../../components/buttons/refreshButton";
import { withNavigationContext } from "../../framework/navigation/components/withNavigationContext";

export const DashboardControlBar = withNavigationContext(({fullScreen, context}) => {
  return (
    <div className={styles["controlbar"]}>
      <nav className={styles["menu"]} style={{width: "33%"}}>
        <NavigationControls itemClass={styles["menu-item"]} />
      </nav>
      <nav className={`${styles["menu"]} ${styles["menu-center"]}`} style={{width: "33%"}}>
        {fullScreen ? <i className={context.icon()} />: null}
        {fullScreen ? context.display() : null}
      </nav>
      <nav className={`${styles["menu"]} ${styles["menu-right"]}`} style={{width: "33%"}}>
        <FullscreenBtn componentId="app-content-area" />
        <RefreshButton />
        <PollButton />
      </nav>
    </div>
  );
});

