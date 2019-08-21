import React from "react";
import {ApolloProvider} from 'react-apollo';
import {vcs_service} from "../../../../services/graphql";

import {SelectConnectorWidget} from "../../../../components/workflow/connectors/selectConnectorWidget";


export class SelectConnectorStep extends React.Component {
  render() {
    return (
      <div className={'select-connector'}>
        <ApolloProvider client={vcs_service}>
          <SelectConnectorWidget
            connectorType={this.props.selectedConnectorType}
            onConnectorSelected={this.props.onConnectorSelected}
            organizationKey={this.props.organizationKey}
          />
        </ApolloProvider>
      </div>
    )
  }
}