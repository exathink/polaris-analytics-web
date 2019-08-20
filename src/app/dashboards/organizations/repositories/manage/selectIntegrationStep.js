import React from "react";
import {Row, Col, Card, Avatar} from "antd";

const {Meta} = Card;

export class SelectIntegrationStep extends React.Component {


  render() {
    return (
      <div className={'select-connector'}>
        <div style={{padding: '30px'}}>
          <Row gutter={16}>
            <Col span={8}>
              <a onClick={() => this.props.onConnectorTypeSelected('github')}>
                <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}>
                  <Meta
                    avatar={
                      <Avatar src="/images/third-party/GitHub-Mark-120px-plus.png"/>
                    }
                    title="Github"
                    description="Import Repositories and Commits"
                  />
                </Card>
              </a>
            </Col>
            {
            /**
            <Col span={8}>
              <a onClick={() => this.props.onConnectorTypeSelected('bitbucket')}>
                <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}>
                  <Meta
                    avatar={
                      <Avatar src="/images/third-party/bitbucket-mark-contained-gradient-neutral@2x.png"/>
                    }
                    title="Bit Bucket"
                    description="Import Repositories and Commits"
                  />
                </Card>
              </a>
            </Col>
            <Col span={8}>
              <a onClick={() => this.props.onConnectorTypeSelected('gitlab')}>
                <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}>
                  <Meta
                    avatar={
                      <Avatar src="/images/third-party/gitlab-icon-rgb.svg"/>
                    }
                    title="GitLab"
                    description="Import Repositories and Commits"
                  />
                </Card>
              </a>
            </Col>
            **/
            }
          </Row>
        </div>

      </div>
    )
  }
}