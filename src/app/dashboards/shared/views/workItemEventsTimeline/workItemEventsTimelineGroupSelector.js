import React from 'react';
import {Flex, Box} from 'reflexbox'
import {RadioGroup, RadioButton} from "../../../../../components/uielements/radio";

const buttons = {
  'workItem': <RadioButton key='workItem' value={'workItem'}>WorkItem</RadioButton>,
  'event': <RadioButton key='event' value={'event'}>Event</RadioButton>,
  'source': <RadioButton key='source' value={'source'}>Source</RadioButton>,
  'type': <RadioButton key='type' value={'type'}>Type</RadioButton>,
}

export class WorkItemEventsTimelineGroupSelector extends React.Component {

  constructor(props) {
    super(props);

  }

  onChange = (e) => {


    if(this.props.onGroupingChanged) {
      this.props.onGroupingChanged(e.target.value)
    }
  }

  render() {
    const { groupings } = this.props;
    return (
      groupings ?
        <Flex>
          <Box pr={1} pt={"1px"}>
          Group By
          </Box>
          <Box>
            <RadioGroup  onChange={this.onChange} value={this.props.selectedGrouping} size={"small"}>
              {
                groupings.map(grouping => buttons[grouping])
              }
            </RadioGroup>
          </Box>
        </Flex>
        : null
    );
  }
}
