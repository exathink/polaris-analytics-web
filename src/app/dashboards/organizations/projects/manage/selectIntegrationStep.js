import React from "react";
import {Row, Col, Card, Avatar} from "antd";
import {TRELLO_CONNECTOR} from "../../../../../config/featureFlags";

const {Meta} = Card;

export class SelectIntegrationStep extends React.Component {
  render() {
    const {viewerContext} = this.props;

    return (
      <div className={'select-connector'}>
        <div style={{padding: '30px'}}>
          <Row gutter={16}>
            <Col span={8}>
              <Card hoverable={true} bordered={true} style={{width: 300, marginTop: 16}}
                    onClick={() => this.props.onConnectorTypeSelected('jira')}>
                <Meta
                  avatar={
                    <Avatar src="/images/third-party/jira-mark-contained-gradient-neutral@2x.png"/>
                  }
                  title="Jira"
                  description="Import Projects and Issues"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}
                    onClick={() => this.props.onConnectorTypeSelected('github')}>
                <Meta
                  avatar={
                    <Avatar src="/images/third-party/GitHub-Mark-120px-plus.png"/>
                  }
                  title="Github"
                  description="Import Repository Issues"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}
                    onClick={() => this.props.onConnectorTypeSelected('pivotal')}>
                <Meta
                  avatar={
                    <Avatar src="/images/third-party/Tracker_Icon.svg"/>
                  }
                  title="Pivotal Tracker"
                  description="Import Projects and Stories"
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
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
                  description="Import Projects and Issues"
                />
              </Card>
            </Col>
            {
              viewerContext.isFeatureFlagActive(TRELLO_CONNECTOR) ?
                <Col span={8}>
                  <Card bordered={true} hoverable={true} style={{width: 300, marginTop: 16}}
                        onClick={() => this.props.onConnectorTypeSelected('trello')}>
                    <Meta
                      avatar={
                        <Avatar src="/images/third-party/trello.png"/>
                      }
                      title="Trello"
                      description="Import Boards and Cards"
                    />
                  </Card>
                </Col>
                :
                null
            }
          </Row>
        </div>
      </div>
    )
  }
}