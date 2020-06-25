import React from "react";
import {Card, Icon} from "antd";
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
      {...iconType ? {actions: [<Icon type={iconType}/>]} : {}}
    >
      {
        description &&
        <Card.Meta
          description={description}
        />
      }
    </Card>
)