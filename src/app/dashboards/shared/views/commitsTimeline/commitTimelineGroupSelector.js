import React from 'react';
import {Flex, Box} from 'reflexbox'
import {RadioGroup, RadioButton} from "../../../../../components/uielements/radio";

const buttons = {
  'repository': <RadioButton value={'repository'}>Repository</RadioButton>,
  'author': <RadioButton value={'author'}>Author</RadioButton>,
  'workItem': <RadioButton value={'workItem'}>WorkItems</RadioButton>
}

export class CommitTimelineRollupSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.groupings ? props.groupings[0] : null
    }
  }

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
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
            <RadioGroup  onChange={this.onChange} value={this.state.value} size={"small"}>
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
