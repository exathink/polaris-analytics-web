import React from "react";
import {Icon} from "antd";
import {LauncherCard} from "./launcher/launcherCard";

export const ImportProjectsCard = ({onClick, title, style, compact}) => (

    <LauncherCard
      title={title || "Import Remote Projects"}
      onClick={onClick}
      cover={
        <img
          alt="example"
          src="/images/third-party/planning-12-512.png"
        />
      }
      style={style || {marginTop: 50}}
      {
        ...compact ?
            {}
            :
            {iconType: 'download', description: "Import from Jira, Pivotal Tracker, etc.."}
      }
    />

)