import React from "react";
import {Radio, Row, Col, Card, Avatar} from "antd";
import {ApolloProvider} from 'react-apollo';
import {work_tracking_service} from "../../../../services/graphql";

import {SelectConnectorWidget} from "../../../../components/workflow/connectors/selectConnectorWidget";
import {getConnectorTypeDisplayName} from "../../../../components/workflow/connectors/utility";

const {Meta} = Card;

export const SelectConnectorType = ({connectorType, onConnectorTypeSelected}) => (
  <Radio.Group
    name="connectorType"
    value={connectorType}
    buttonStyle={"solid"}
    onChange={
      e => onConnectorTypeSelected(e.target.value)
    }
  >
    <Radio.Button value={'jira'}>{getConnectorTypeDisplayName('jira')}</Radio.Button>
    <Radio.Button value={'pivotal'}>{getConnectorTypeDisplayName('pivotal')}</Radio.Button>
    <Radio.Button value={'github'}>{getConnectorTypeDisplayName('github')}</Radio.Button>
  </Radio.Group>
);


function getWorkTrackingType(connector) {
  const {connectorType, productType} = connector;
  if (connectorType) {
    switch (connectorType) {
      case 'atlassian':
        return 'jira'; // This could be replaced with productType, but right now the back end does not return this.
      default:
        return connectorType
    }
  }

}

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