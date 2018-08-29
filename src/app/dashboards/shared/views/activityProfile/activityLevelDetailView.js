// @flow
import type {ActivitySummary} from './model'
import {ActivityLevelDetailModel} from "./model";
import React, {Fragment} from 'react';
import {VizItem, VizRow} from "../../containers/layout/index";
import {CustomTabPanel, Tab, TabList, Tabs} from '../../containers/tab/index';

import {DimensionConnectionInceptionsWidget} from "../../widgets/accountHierarchy";

import {
  ActivityLevelsBubbleChart,
  ActivityLevelsTable,
  ActivityLevelsTimelineChart,
  ActivityProfileBarChart
} from "./components/index";

export type Props = {
  model: ActivityLevelDetailModel,
  enableDrillDown: boolean,
  onActivitiesSelected: (any) => void,
  selectedActivities: Array<ActivitySummary> | null,
  onDrillDown? : (event:any) => void
}







const DetailTabs = (props) => (
  <Tabs>
    <TabList>
      <Tab>History</Tab>
      <Tab>Inceptions</Tab>
    </TabList>

    <CustomTabPanel>
      <ActivityLevelsTimelineChart {...props}/>
    </CustomTabPanel>
    <CustomTabPanel>
      <DimensionConnectionInceptionsWidget
        instanceKey={props.model.instanceKey}
        dimension={props.model.dimension}
        connection={props.model.childDimension}
      />
    </CustomTabPanel>
  </Tabs>
);

const MaxView = (props) => (
  <Fragment>
    <VizRow h={"60%"}>
      <VizItem w={0.07}>
        <ActivityProfileBarChart orientation={'vertical'} {...props}/>
      </VizItem>
      <VizItem w={0.5}>
        <ActivityLevelsBubbleChart {...props}/>
      </VizItem>
      <VizItem w={0.43}>
        <DetailTabs {...props}/>
      </VizItem>
    </VizRow>
    <VizRow h={"40%"}>
      <VizItem w={1}>
        <ActivityLevelsTable {...props}/>
      </VizItem>
    </VizRow>
  </Fragment>
);


type MaxViewState = {
  selected: Array<ActivitySummary> | null
}

export class ActivityLevelDetailView extends React.Component<Props, MaxViewState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  onActivitiesSelected(activities: Array<ActivitySummary>) {
    this.setState({
      selected: activities
    })
  }


  render() {
    return (
      <MaxView
        onSelectionChange={this.onActivitiesSelected.bind(this)}
        selectedActivities={this.state.selected}
        onDrillDown={this.props.enableDrillDown? this.props.onDrillDown || this.props.model.onDrillDown.bind(this.props.model) : null}
        {...this.props}
      />
    );
  }
}




