import React from "react";
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Card } from "antd";
import './launcherCard.css';
import fontStyles from "../../../framework/styles/fonts.module.css";
import classNames from "classnames";
import {CheckCircleFilled} from "@ant-design/icons";
import {Colors} from "../../../dashboards/shared/config";

export const LauncherCard = ({onClick, title, description, cover, style, iconType}) => (
    <Card
      onClick={onClick}
      className={'launcher-card'}
      hoverable={true}
      bordered={true}
      title={title}
      cover={cover}
      style={style}
      {...iconType ? {actions: [<LegacyIcon type={iconType}/>]} : {}}
    >
      {
        description &&
        <Card.Meta
          description={description}
        />
      }
    </Card>
)

export function Launcher({onClick, title, description, icon, completed, testId}) {
  return (
    <div className="launcherWrapper" onClick={onClick} data-testid={testId}>
      <div className="launcherIcon">{icon}</div>
      <div className="launcherTitleWrapper">
        <div className={classNames("title", fontStyles["text-2xl"], fontStyles["font-medium"])}>{title}</div>
        <div className={classNames("subTitle", fontStyles["text-lg"], fontStyles["font-normal"])}>{description}</div>
      </div>
      <div className="launcherCheck">
        <CheckCircleFilled style={{fontSize: "48px", color: completed ? Colors.Steps.completed: Colors.Steps.pending}} />
      </div>
    </div>
  );
}