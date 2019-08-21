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
              <a onClick={() => this.props.onConnectorTypeSelected('jira')}>
                <Card hoverable={true} bordered={true} style={{width: 300, marginTop: 16}}>
                  <Meta
                    avatar={
                      <Avatar src="/images/third-party/jira-mark-contained-gradient-neutral@2x.png"/>
                    }
                    title="Jira"
                    description="Import Projects and Issues"
                  />
                </Card>
              </a>
            </Col>
            <Col span={8}>
              <a onClick={() => this.props.onConnectorTypeSelected('github')}>
                <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}>
                  <Meta
                    avatar={
                      <Avatar src="/images/third-party/GitHub-Mark-120px-plus.png"/>
                    }
                    title="Github"
                    description="Import Repository Issues"
                  />
                </Card>
              </a>
            </Col>
            <Col span={8}>
              <a onClick={() => this.props.onConnectorTypeSelected('pivotal')}>
                <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}>
                  <Meta
                    avatar={
                      <Avatar src="/images/third-party/Tracker_Icon.svg"/>
                    }
                    title="Pivotal Tracker"
                    description="Import Projects and Stories"
                  />
                </Card>
              </a>
            </Col>
          </Row>
        </div>

      </div>
    )
  }
}