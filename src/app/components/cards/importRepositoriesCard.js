import React from "react";
import {Card, Icon} from "antd";

export const ImportRepositoriesCard = ({onClick}) => (
  <a onClick={onClick}>
    <Card
      hoverable={true}
      bordered={true}
      title={"Import Repositories"}
      cover={
        <img
          alt="example"
          src="/images/third-party/git-logomark-black@2x.png"
        />
      }
      style={{width: 300, marginTop: 50}}
      actions={[

        <Icon type="download" key="edit"/>,

      ]}
    >
      <Card.Meta
        description={"Import from Github, Bitbucket, etc.."}
      />
    </Card>
  </a>
)