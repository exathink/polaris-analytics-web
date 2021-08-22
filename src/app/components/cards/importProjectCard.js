import React from "react";
import {WorkTrackingIcon} from "../misc/customIcons";
import {Launcher} from "./launcher/launcherCard";

export const ImportProjectsCard = ({onClick, title, style, compact, completed}) => (

    <Launcher
      title={title || "Import Remote Projects"}
      description={"Import from Jira, Trello, Pivotal Tracker, etc.."}
      onClick={onClick}
      icon={
        <WorkTrackingIcon />
      }
      completed={completed}
    />

)