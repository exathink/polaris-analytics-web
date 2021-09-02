import {Popover} from "antd";
import {InfoDrawer} from "./infoDrawer";
import {InfoCircleOutlined} from "@ant-design/icons";
import React from "react";

export function InfoCard({title, content, drawerContent, className = "", drawerOptions={}}) {
  return (
    <Popover
      title={title}
      content={
        <div>
          <p>{content}</p>
          <InfoDrawer title={title} content={drawerContent} drawerOptions={drawerOptions}/>
        </div>
      }
    >
      <div className={className}>
        <InfoCircleOutlined style={{ fontSize: '12px' }}/>
      </div>
    </Popover>
  );
}
