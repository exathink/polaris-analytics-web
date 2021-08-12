import React from "react";
import {Launcher} from "./launcher/launcherCard";
import {WorkTrackingIcon} from "./launcher/workTrackingIcon"

export const ImportProjectsCard = ({onClick, title, style, compact}) => (

    <Launcher
      title={title || "Import Remote Projects"}
      description={"Import from Jira, Pivotal Tracker, etc.."}
      onClick={onClick}
      icon={
        <WorkTrackingIcon />
      }
      
    />

)