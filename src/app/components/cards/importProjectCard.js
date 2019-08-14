import React from "react";
import {Card, Icon} from "antd";

export const ImportProjectsCard = ({onClick}) => (
  <a onClick={onClick}>
    <Card
      hoverable={true}
      bordered={true}
      title={"Import Projects"}
      cover={
        <img
          alt="example"
          src="/images/third-party/planning-12-512.png"
        />
      }
      style={{width: 300, marginTop: 50}}
      actions={[

        <Icon type="download" key="edit"/>,

      ]}
    >
      <Card.Meta
        description={"Import from Jira, Pivotal Tracker, etc.."}
      />


    </Card>
  </a>
)