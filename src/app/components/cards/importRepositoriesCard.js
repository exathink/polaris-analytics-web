import React from "react";
import {Launcher} from "./launcher/launcherCard";
import {VersionControlIcon} from "./launcher/versionControlIcon"
export const ImportRepositoriesCard = ({onClick, title, style, compact, completed}) => (
    <Launcher
      onClick={onClick}
      title={title || "Import Repositories"}
      description={"Import from Github, Bitbucket etc.."}
      icon={
        <VersionControlIcon />
      }
      completed={completed}
      />

)