import React from "react";
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";
import {withViewerContext} from "../../app/framework/viewer/viewerContext";
import {VIDEO_GUIDANCE} from "../../config/featureFlags";

export const VideoButton = withViewerContext(
  withNavigationContext(({viewerContext, enableVideo, setEnableVideo}) => {
    const buttonClass = !enableVideo ? "toggleOff" : "";
    return viewerContext.isFeatureFlagActive(VIDEO_GUIDANCE) ? (
      <i
        title={`Video guidance ${enableVideo ? "enabled" : "disabled"} `}
        className={`menu-item ${buttonClass} ion ion-videocamera`}
        onClick={() => setEnableVideo(!enableVideo)}
      />
    ) : null;
  })
);
