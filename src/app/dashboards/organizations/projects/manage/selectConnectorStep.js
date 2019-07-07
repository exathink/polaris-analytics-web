import React from "react";
import {Radio} from "antd";

import {SelectConnectorWidget} from "../../../../components/workflow/workTracking/selectConnectorWidget";


export const SelectConnectorType = ({connectorType, onChange}) => (
  <Radio.Group
    name="connectorType"
    value={connectorType}
    buttonStyle={"solid"}
    onChange={onChange}
  >
    <Radio.Button value={'jira'}>Jira</Radio.Button>
    <Radio.Button value={'pivotal'}>Pivotal Tracker</Radio.Button>
    <Radio.Button value={'github'}>Github</Radio.Button>
  </Radio.Group>
);

export class SelectConnectorStep extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connectorType: props.selectedConnector.connectorType || 'jira'
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

        <SelectConnectorWidget
          connectorType={this.state.connectorType}
          onConnectorSelected={this.props.onConnectorSelected}
        />
      </div>
    )
  }
}