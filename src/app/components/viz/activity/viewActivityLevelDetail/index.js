// @flow
import type {ActivitySummary, Props} from './domain'
import React, {Fragment} from 'react';
import {VizItem, VizRow} from "../../containers/layout/index";

import {CustomTabPanel, Tab, TabList, Tabs} from '../../containers/tab/index';

import {
  ActivitySummaryBubbleChart,
  ActivitySummaryTable,
  ActivitySummaryTimelineChart,
  TotalsBarChart,
} from './components/index';


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

const MaxView = (props) => (
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

export default class extends React.Component<Props, MaxViewState> {

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


