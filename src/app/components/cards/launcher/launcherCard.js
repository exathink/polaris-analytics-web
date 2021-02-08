import React from "react";
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Card } from "antd";
import './launcherCard.css';

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