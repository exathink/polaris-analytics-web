import React from "react";
import {withNavigationContext} from "../../app/framework/navigation/components/withNavigationContext";

export const VideoButton = withNavigationContext(function (props) {
  const {enableVideo, setEnableVideo} = props;
  const buttonClass = !enableVideo ? "toggleOff" : "";
  return (
    <i
      title={`Video ${enableVideo ? "enabled" : "disabled"}`}
      className={`menu-item ${buttonClass} ion ion-videocamera`}
      onClick={() => setEnableVideo(!enableVideo)}
    />
  );
});
