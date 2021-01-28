import React from "react";
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";
import {EmbedVideoPlayer, useVideo} from "../../app/framework/viz/videoPlayer/videoPlayer";
import "./DashboardLevelVideo.css";

export const DashboardLevelVideo = withNavigationContext(({enableVideo, activeDashboardVideoConfig, fullScreen}) => {
  const videoState = useVideo();
  return (
    <span>
      {!fullScreen && enableVideo && activeDashboardVideoConfig && (
        <EmbedVideoPlayer {...activeDashboardVideoConfig} {...videoState} className="menu-item ion mt-13" />
      )}
    </span>
  );
});
