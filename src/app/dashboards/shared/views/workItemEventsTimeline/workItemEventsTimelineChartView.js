import React from 'react';
import {WorkItemEventsTimelineChart} from "./index";
import {Box, Flex} from 'reflexbox';
import {WorkItemEventsTimelineRollupBarchart} from './workItemEventsTimelineRollupBarchart'
import {WorkItemEventsTimelineChartModel} from "./workItemEventsTimelineChartModel";
import {WorkItemEventsTimelineGroupSelector} from "./workItemEventsTimelineGroupSelector";


export class WorkItemEventsTimelineChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGrouping: props.groupBy
    }
  }

  onGroupingChanged(groupBy) {
    const {
      workItemEvents,
      workItemCommits,
      totalWorkItems,
    } = this.props;

    this.setState({
      model: new WorkItemEventsTimelineChartModel(workItemEvents, workItemCommits, totalWorkItems, groupBy),
      selectedGrouping: groupBy,
      selectedCategories: null,
      selectedCommits: null
    })
  }


  onCategoriesSelected(selected) {
    const {
      workItemEvents,
      workItemCommits,
      totalWorkItems,
      onSelectionChange,
    } = this.props;

    const model = new WorkItemEventsTimelineChartModel(workItemEvents, workItemCommits, totalWorkItems, this.state.selectedGrouping, selected)
    this.setState({
      ...this.state,
      model: model,
      selectedCategories: selected
    });
    if(onSelectionChange) {
        onSelectionChange(model.workItemEvents)
    }
  }

  onWorkItemEventsSelected(workItemEvents) {
    const {
      onSelectionChange,
      showTable,
      view,
    } = this.props;

    // we set this state to suppress further
    // updates to props.workItemEvents until selections are done.
    // The selections also feed the workItemEvents table if its being shown.
    this.setState({
      ...this.state,
      selectedWorkItemEvents: workItemEvents,
    });

    if(onSelectionChange) {
        onSelectionChange(workItemEvents)
    } else if(view !== 'detail' || !showTable) {
      //this.navigateToWorkItemEvent(workItemEvents)
    }
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      workItemEvents,
      workItemCommits,
      totalWorkItems,
      groupBy
    } = nextProps;

    let state = null;
    if (!prevState.selectedCategories && !prevState.selectedWorkItemEvents) {
        state = {
          ...prevState,
          model: new WorkItemEventsTimelineChartModel(workItemEvents, workItemCommits, totalWorkItems, groupBy),
          selectedCategories: null,
          selectedWorkItemEvents: null
        }
    }
    return state;
  }

  getWorkItemEventsTimelineChart(model) {
    const {
      instanceKey,
      context,
      days,
      before,
      latestWorkItemEvent,
      latest,
      totalWorkItemEvents,
      totalWorkItems,
      view,
      shortTooltip,
      markLatest,
      polling,

    } = this.props;

    return (
      <WorkItemEventsTimelineChart
        model={model}
        context={context}
        instanceKey={instanceKey}
        view={view}
        days={days}
        before={before}
        latestWorkItemEvent={latestWorkItemEvent}
        latest={latest}
        totalWorkItemEvents={totalWorkItemEvents}
        totalWorkItems={totalWorkItems}
        shortTooltip={shortTooltip}
        markLatest={markLatest}
        polling={polling}
        onSelectionChange={this.onWorkItemEventsSelected.bind(this)}
        showScrollbar={true}
      />
    )
  }

  getTimelineRollupHeader() {
    const {workItemEvents, workItemCommits, totalWorkItems} = this.props;
    return (
      <WorkItemEventsTimelineRollupBarchart
        model={new WorkItemEventsTimelineChartModel(workItemEvents, workItemCommits, totalWorkItems,  this.state.selectedGrouping)}
        onSelectionChange={this.onCategoriesSelected.bind(this)}
      />
    )
  }


  getTimelineTable(workItemEvents) {
    return (
      null
      /*
      <WorkItemsTimelineTable
        workItemEvents={this.state.selectedWorkItemEvents || workItemEvents}
      />
      */
    )
  }

  showHeader() {
    const {
      showHeader
    } = this.props;

    return (
      this.state.selectedCategories ?
        showHeader
        :
        (
          showHeader &&
          Object.keys(this.state.model.categoriesIndex).length > 1
        )
    );
  }


  getPrimaryLayout(height, model) {


    return (

        <Flex column style={{height: height, width: "100%"}}>
          <Flex column align='center' style={{height: "5%"}}>
            <WorkItemEventsTimelineGroupSelector groupings={this.props.groupings} onGroupingChanged={this.onGroupingChanged.bind(this)}/>
          </Flex>
          <Flex style={{height:"95%"}}>
            <Box w={this.showHeader() ? "90%" : "100%"}>


              {
                this.getWorkItemEventsTimelineChart(model)
              }

            </Box>
            {
              this.showHeader() ?
                <Box w={"10%"}>
                  {
                    this.getTimelineRollupHeader()
                  }
                </Box>
                : null
            }
          </Flex>
        </Flex>
    )
  }

  getDetailLayout(model, showHeader, showTable) {
    return (
      <Flex column style={{height: "100%", width: "100%"}}>
        {
          this.getPrimaryLayout(showTable ? "72%" : "100%", model)
        }
        {
          showTable ?
            <Flex style={{height: "28%", width: "100%"}}>
              {
                this.getTimelineTable(model.workItemEvents)
              }
            </Flex>
            : null
        }
      </Flex>
    )
  }

  render() {
    const {
      view,
      showHeader,
      showTable,
    } = this.props;

    return (
      view === 'detail' ?
        this.getDetailLayout(this.state.model, showHeader, showTable)
        : this.getPrimaryLayout('95%', this.state.model, showHeader)
    )

  }

}