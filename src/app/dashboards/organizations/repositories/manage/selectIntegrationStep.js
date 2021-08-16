import React from "react";
import {Avatar, Card, Col, Row} from "antd";
import Button from "../../../../../components/uielements/button";
import styles from "./addRepositoryWorkflow.module.css";

const {Meta} = Card;

export class SelectIntegrationStep extends React.Component {


  render() {
    return (
      <div className={styles.selectConnector}>
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
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
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
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
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
                <Button type="secondary" size="small" style={{marginTop: "10px"}}>Install</Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}