// @flow
import type {ActivitySummary, Props} from './types'
import React, {Fragment} from 'react';
import {VizItem, VizRow} from "../containers/layout";
import {withMaxMinViews} from "../helpers/viewSelectors";

import {CustomTabPanel, Tab, TabList, Tabs} from '../containers/tab';

import {
  ActivitySummaryBubbleChart,
  ActivitySummaryTimelineChart,
  ActivitySummaryTable,
  TotalsBarChart,
} from './components';


const DetailTabs = (props) => (
  <Tabs>
    <TabList>
      <Tab>Timelines</Tab>
      <Tab>Totals</Tab>
    </TabList>

    <CustomTabPanel>
      <ActivitySummaryTimelineChart {...props}/>
    </CustomTabPanel>
    <CustomTabPanel>
      <TotalsBarChart {...props}/>
    </CustomTabPanel>
  </Tabs>
);

const MaxViewFull = (props) => (
  <Fragment>
    <VizRow h={"60%"}>
      <VizItem w={0.07}>
        <TotalsBarChart {...props}/>
      </VizItem>
      <VizItem w={0.5}>
        <ActivitySummaryBubbleChart {...props}/>
      </VizItem>
       <VizItem w={0.43}>
        <DetailTabs {...props}/>
      </VizItem>
    </VizRow>
    <VizRow h={"40%"}>
      <VizItem w={1}>
        <ActivitySummaryTable {...props}/>
      </VizItem>
    </VizRow>
  </Fragment>
);


type MaxViewState = {
  selected: Array<ActivitySummary> | null
}

class ActivitySummaryMaxView extends React.Component<Props, MaxViewState> {

  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  onActivitiesSelected(activities) {
    this.setState({
      selected: activities
    })
  }


  render() {
    return (
        <MaxViewFull
          onActivitiesSelected={this.onActivitiesSelected.bind(this)}
          selectedActivities={this.state.selected}
          {...this.props}
        />
    );
  }
}

export const ActivitySummaryViz = withMaxMinViews({
  minimized: ActivitySummaryBubbleChart,
  maximized: ActivitySummaryMaxView
});
