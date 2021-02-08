import React from "react";
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";
import {EmbedVideoPlayer, useVideo} from "../../app/framework/viz/videoPlayer/videoPlayer";
import styles from "./buttons.module.css";

export const DashboardLevelVideo = withNavigationContext(({enableVideo, activeDashboardVideoConfig, fullScreen}) => {
  const videoState = useVideo();
  return (
    <span>
      {!fullScreen && enableVideo && activeDashboardVideoConfig && (
        <EmbedVideoPlayer {...activeDashboardVideoConfig} {...videoState} className={styles["menu-item"] + " ion"} />
      )}
    </span>
  );
});
