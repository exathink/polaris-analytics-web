import React from "react";
import {Avatar, Card, Col, Row} from "antd";

const {Meta} = Card;

export class SelectIntegrationStep extends React.Component {


  render() {
    return (
      <div className={"select-connector"}>
        <div style={{padding: "30px"}}>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                bordered={true}
                hoverable={true}
                style={{width: 300, marginTop: 16}}
                onClick={() => this.props.onConnectorTypeSelected("github")}
              >
                <Meta
                  avatar={<Avatar src="/images/third-party/GitHub-Mark-120px-plus.png" />}
                  title="Github"
                  description="Import Repositories and Commits"
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card
                bordered={true}
                hoverable={true}
                style={{width: 300, marginTop: 16}}
                onClick={() => this.props.onConnectorTypeSelected("bitbucket")}
              >
                <Meta
                  avatar={<Avatar src="/images/third-party/bitbucket-mark-contained-gradient-neutral@2x.png" />}
                  title="Bit Bucket"
                  description="Import Repositories and Commits"
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card
                bordered={true}
                hoverable={true}
                style={{width: 300, marginTop: 16}}
                onClick={() => this.props.onConnectorTypeSelected("gitlab")}
              >
                <Meta
                  avatar={<Avatar src="/images/third-party/gitlab-icon-rgb.svg" />}
                  title="GitLab"
                  description="Import Repositories and Commits"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}