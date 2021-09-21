import React from "react";
import {VersionControlIcon} from "../misc/customIcons";
import {Launcher} from "./launcher/launcherCard";

export const ImportRepositoriesCard = ({onClick, title, style, compact, completed, testId}) => (
    <Launcher
      onClick={onClick}
      title={title || "Import Repositories"}
      description={"Import from Github, Bitbucket etc.."}
      icon={
        <VersionControlIcon />
      }
      completed={completed}
      testId={testId}
      />

)