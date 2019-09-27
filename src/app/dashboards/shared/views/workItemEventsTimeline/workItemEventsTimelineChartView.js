import React, {useState} from 'react';
import {WorkItemEventsTimelineChart} from "./index";
import {Box, Flex} from 'reflexbox';
import {WorkItemEventsTimelineRollupBarchart} from './workItemEventsTimelineRollupBarchart'
import {WorkItemEventsTimelineChartModel} from "./workItemEventsTimelineChartModel";
import {DaysRangeSlider} from "../../components/daysRangeSlider/daysRangeSlider";
import {GroupingSelector} from "../../components/groupingSelector/groupingSelector";
import {Tabs} from 'antd';

const {TabPane} = Tabs;

const workItemEventsTimelineGroupings = {
  workItem: "Work Item",
  event: "Event",
  type: "Type",
  source: "Source",
}

class WorkItemEventsTimelinePane extends React.Component {
  constructor(props) {
    super(props);
    const {
      workItemEvents,
      workItemCommits,
      groupBy,
      stateFilter
    } = this.props;

    this.state = {
      model: new WorkItemEventsTimelineChartModel(workItemEvents, workItemCommits, groupBy, stateFilter),
      selectedGrouping: groupBy,
      selectedCategories: null,
      selectedCommits: null,
    }
  }

  componentDidUpdate() {
    const {model} = this.state;
    const {workItemEvents, workItemCommits, stateFilter} = this.props
    if (model.workItemEvents !== workItemEvents || model.workItemCommits !== workItemCommits) {
      this.setState({
        model: new WorkItemEventsTimelineChartModel(
          workItemEvents, workItemCommits, this.state.selectedGrouping,
          stateFilter),
      })
    }
  }



  onGroupingChanged(groupBy) {
    const {
      workItemEvents,
      workItemCommits,
      stateFilter
    } = this.props;

    this.setState({
      model: new WorkItemEventsTimelineChartModel(workItemEvents, workItemCommits, groupBy, stateFilter),
      selectedGrouping: groupBy,
      selectedCategories: null,
      selectedCommits: null
    })
  }


  onCategoriesSelected(selected) {
    const {
      workItemEvents,
      workItemCommits,
      stateFilter,
      onSelectionChange,
    } = this.props;

    const model = new WorkItemEventsTimelineChartModel(
      workItemEvents, workItemCommits, this.state.selectedGrouping, stateFilter, selected
    )
    this.setState({
      ...this.state,
      model: model,
      selectedCategories: selected
    });
    if (onSelectionChange) {
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

    if (onSelectionChange) {
      onSelectionChange(workItemEvents)
    } else if (view !== 'detail' || !showTable) {
      //this.navigateToWorkItemEvent(workItemEvents)
    }
  }


  getWorkItemEventsTimelineChart(model) {
    const {
      instanceKey,
      context,
      days,
      before,
      latestEvent,
      latest,
      totalWorkItemEvents,
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
        latestEvent={latestEvent}
        latest={latest}
        totalWorkItemEvents={totalWorkItemEvents}
        shortTooltip={shortTooltip}
        markLatest={markLatest}
        polling={polling}
        onSelectionChange={this.onWorkItemEventsSelected.bind(this)}
        showScrollbar={true}
      />
    )
  }

  getTimelineRollupHeader() {
    const {workItemEvents, workItemCommits, stateFilter} = this.props;
    return (
      <WorkItemEventsTimelineRollupBarchart
        model={new WorkItemEventsTimelineChartModel(workItemEvents, workItemCommits, this.state.selectedGrouping, stateFilter)}
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
    const {showHeader, view, days, setDaysRange, groupings} = this.props;
    const {selectedGrouping} = this.state;
    const showSlider = view === 'detail';
    return (

      <Flex column style={{height: height, width: "100%"}}>
        <Flex pl={1} pt={2} pb={2} pr={10} align='center' justify={showSlider ? 'left' : 'center'}
              style={{height: "5%"}}>
          {
            showSlider &&
            <Box w={"35%"}>
              <DaysRangeSlider initialDays={days} setDaysRange={setDaysRange}/>
            </Box>
          }
          <Box>
            <GroupingSelector
              groupings={
                groupings.map(
                  grouping => ({
                    key: grouping,
                    display: workItemEventsTimelineGroupings[grouping]
                  })
                )
              }
              initialValue={selectedGrouping}
              onGroupingChanged={this.onGroupingChanged.bind(this)}/>
          </Box>
        </Flex>
        <Flex style={{height: "95%"}}>
          <Box w={showHeader ? "90%" : "100%"}>


            {
              this.getWorkItemEventsTimelineChart(model)
            }

          </Box>
          {
            showHeader ?
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

export const WorkItemEventsTimelineChartView = props => {
  const [filter, setFilter] = useState('in-progress')
  return (
    <Tabs
      defaultActiveKey="in-progress"
      style={{height: "100%"}}
      onTabClick={key => setFilter(key)}>
      <TabPane tab="In-Progress" key="in-progress" style={{height: "100%"}}>
        <WorkItemEventsTimelinePane stateFilter={filter} {...props} />
      </TabPane>
      <TabPane tab="New" key="new" style={{height: "100%"}}>
        <WorkItemEventsTimelinePane stateFilter={filter} {...props} />
      </TabPane>
      <TabPane tab="Complete" key="terminal" style={{height: "100%"}}>
        <WorkItemEventsTimelinePane stateFilter={filter} {...props} />
      </TabPane>
    </Tabs>
  )
}

