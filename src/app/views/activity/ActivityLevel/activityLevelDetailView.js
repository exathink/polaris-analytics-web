// @flow
import type {ActivitySummary} from './model'
import {ActivityLevelDetailModel} from "./model";
import React, {Fragment} from 'react';
import {VizItem, VizRow} from "../../containers/layout/index";
import {CustomTabPanel, Tab, TabList, Tabs} from '../../containers/tab/index';

import {ActivitySummaryTimelineChartViz} from "./viz";
import {ActivitySummaryBubbleChartViz} from "./viz";
import {ActivitySummaryTableViz} from "./viz";
import {TotalsBarChartViz} from "./viz";

export type Props = {
  model: ActivityLevelDetailModel,
  onActivitiesSelected: (any) => void,
  selectedActivities: Array<ActivitySummary> | null
}







const DetailTabs = (props) => (
  <Tabs>
    <TabList>
      <Tab>History</Tab>
      <Tab>Totals</Tab>
    </TabList>

    <CustomTabPanel>
      <ActivitySummaryTimelineChartViz {...props}/>
    </CustomTabPanel>
    <CustomTabPanel>
      <TotalsBarChartViz orientation={'horizontal'} {...props}/>
    </CustomTabPanel>
  </Tabs>
);

const MaxView = (props) => (
  <Fragment>
    <VizRow h={"60%"}>
      <VizItem w={0.07}>
        <TotalsBarChartViz orientation={'vertical'} {...props}/>
      </VizItem>
      <VizItem w={0.5}>
        <ActivitySummaryBubbleChartViz {...props}/>
      </VizItem>
      <VizItem w={0.43}>
        <DetailTabs {...props}/>
      </VizItem>
    </VizRow>
    <VizRow h={"40%"}>
      <VizItem w={1}>
        <ActivitySummaryTableViz {...props}/>
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
        {...this.props}
      />
    );
  }
}




