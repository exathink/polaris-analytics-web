// @flow
import type {ActivitySummary} from './model'
import React, {Fragment} from 'react';
import {VizItem, VizRow} from "../../containers/layout/index";

import {CustomTabPanel, Tab, TabList, Tabs} from '../../containers/tab/index';

import {
  ActivitySummaryBubbleChart,
  ActivitySummaryTable,
  ActivitySummaryTimelineChart,
  TotalsBarChart,
} from './components/index';

import {ActivityLevelDetailModel} from "./model";
import {withModel} from "../../../viz/withModel";


export type Props = {
  model: ActivityLevelDetailModel,
  onActivitiesSelected: (any) => void,
  selectedActivities: Array<ActivitySummary> | null
}

const ActivitySummaryBubbleChartViz = withModel(ActivityLevelDetailModel)(ActivitySummaryBubbleChart);
const ActivitySummaryTableViz = withModel(ActivityLevelDetailModel)(ActivitySummaryTable);
const ActivitySummaryTimelineChartViz = withModel(ActivityLevelDetailModel)(ActivitySummaryTimelineChart);
const TotalsBarChartViz = withModel(ActivityLevelDetailModel)(TotalsBarChart);


const DetailTabs = (props) => (
  <Tabs>
    <TabList>
      <Tab>Timelines</Tab>
      <Tab>Totals</Tab>
    </TabList>

    <CustomTabPanel>
      <ActivitySummaryTimelineChartViz {...props}/>
    </CustomTabPanel>
    <CustomTabPanel>
      <TotalsBarChartViz {...props}/>
    </CustomTabPanel>
  </Tabs>
);

const MaxView = (props) => (
  <Fragment>
    <VizRow h={"60%"}>
      <VizItem w={0.07}>
        <TotalsBarChartViz {...props}/>
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
        onActivitiesSelected={this.onActivitiesSelected.bind(this)}
        selectedActivities={this.state.selected}
        {...this.props}
      />
    );
  }
}


