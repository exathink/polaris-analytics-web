import React from "react";
import {Radio} from "antd";
import {ApolloProvider} from 'react-apollo';
import {vcs_service} from "../../../../services/graphql";

import {SelectConnectorWidget} from "../../../../components/workflow/connectors/selectConnectorWidget";


export const SelectConnectorType = ({connectorType, onChange}) => (
  <Radio.Group
    name="connectorType"
    value={connectorType}
    buttonStyle={"solid"}
    onChange={onChange}
  >
    <Radio.Button value={'github'}>GitHub</Radio.Button>
    <Radio.Button value={'bitbucket'}>Bitbucket</Radio.Button>
    <Radio.Button value={'gitlab'}>GitLab</Radio.Button>
  </Radio.Group>
);


export class SelectConnectorStep extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connectorType: props.connector && props.connector.connectorType ? props.connector.connectorType : 'github'
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
        <ApolloProvider client={vcs_service}>
          <SelectConnectorWidget
            connectorType={this.state.connectorType}
            onConnectorSelected={this.props.onConnectorSelected}
            organizationKey={this.props.organizationKey}
          />
        </ApolloProvider>
      </div>
    )
  }
}