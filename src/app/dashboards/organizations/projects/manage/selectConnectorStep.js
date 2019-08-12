import React from "react";
import {Radio} from "antd";
import {ApolloProvider} from 'react-apollo';
import {work_tracking_service} from "../../../../services/graphql";

import {SelectConnectorWidget} from "../../../../components/workflow/connectors/selectConnectorWidget";
import {getConnectorTypeDisplayName} from "../../../../components/workflow/connectors/utility";

export const SelectConnectorType = ({connectorType, onChange}) => (
  <Radio.Group
    name="connectorType"
    value={connectorType}
    buttonStyle={"solid"}
    onChange={onChange}
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
export class SelectConnectorStep extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connectorType: getWorkTrackingType(props.selectedConnector) || 'jira'
    }
  }

  onConnectorTypeChanged(e) {
    this.setState({
      connectorType: e.target.value
    })
  }


  render() {
    return (
      <div className={'select-connector'}>
        <SelectConnectorType
          connectorType={this.state.connectorType}
          onChange={this.onConnectorTypeChanged.bind(this)}
        />
        <ApolloProvider client={work_tracking_service}>
          <SelectConnectorWidget
            connectorType={this.state.connectorType}
            onConnectorSelected={this.props.onConnectorSelected}
            organizationKey={this.props.organizationKey}
            onConnectorsUpdated={this.props.onConnectorsUpdated}
          />
        </ApolloProvider>
      </div>
    )
  }
}