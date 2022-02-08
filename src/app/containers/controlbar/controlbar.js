import React from "react";
import NavigationControls from "../../framework/navigation/components/navigationControls";
import FullscreenBtn from "../../../components/buttons/FullscreenBtn";
import {PollButton} from "../../../components/buttons/pollButton";
import styles from "./controlbar.module.css";
import {VideoButton} from "../../../components/buttons/videoButton";
import {DashboardLevelVideo} from "../../../components/buttons/DashboardLevelVideo";
import {RefreshButton} from "../../../components/buttons/refreshButton";

export const DashboardControlBar = () => {
  return (
    <div className={styles["controlbar"]}>
      <nav className={styles["menu"]} style={{width: "33%"}}>
        <NavigationControls itemClass={styles["menu-item"]} />
      </nav>
      <nav className={`${styles["menu"]} ${styles["menu-center"]}`} style={{width: "33%"}}></nav>
      <nav className={`${styles["menu"]} ${styles["menu-right"]}`} style={{width: "33%"}}>
        <FullscreenBtn componentId="app-content-area" />
        <RefreshButton />
        <PollButton />
      </nav>
    </div>
  );
};
