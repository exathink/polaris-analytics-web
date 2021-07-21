import {Popover} from "antd";
import {InfoDrawer} from "./infoDrawer";
import {InfoCircleOutlined} from "@ant-design/icons";
import React from "react";

export function InfoCard({title, content, content1, className = ""}) {
  return (
    <Popover
      title={title}
      content={
        <div>
          <p>{content}</p>
          <InfoDrawer title={title} content={content1} />
        </div>
      }
    >
      <div className={className}>
        <InfoCircleOutlined style={{ fontSize: '12px' }}/>
      </div>
    </Popover>
  );
}
