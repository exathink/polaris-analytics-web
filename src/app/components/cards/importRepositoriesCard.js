import React from "react";
import {LauncherCard} from "./launcher/launcherCard";

export const ImportRepositoriesCard = ({onClick, title, style, compact}) => (
    <LauncherCard
      onClick={onClick}
      title={title || "Import Repositories"}
      cover={
        <img
          alt="example"
          src="/images/third-party/git-logomark-black@2x.png"
        />
      }
      style={style || {marginTop: 50, marginLeft: 10}}
      {
        ...compact ?
            {}
            :
            {iconType: 'download', description: "Import from Github, Bitbucket etc.."}
      }
      />

)