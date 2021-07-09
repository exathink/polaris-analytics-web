import {Popover} from "antd";
import {InfoDrawer} from "./infoDrawer";
import {InfoCircleOutlined} from "@ant-design/icons";
import React from "react";

export function InfoCard(props: {title: any, content: string | any, content1: any}) {
  return (
    <Popover
      title={props.title}
      content={
        <div>
          <p>{props.content}</p>
          <InfoDrawer title={props.title} content={props.content1} />
        </div>
      }
    >
      <InfoCircleOutlined />
    </Popover>
  );
}