import React from 'react';
import {DashboardRow} from "../../../../framework/viz/dashboard";
import {CumulativeCommitCountChart} from "./index";
import {CommitsTimelineTable} from "../commitsTimeline";
import {DimensionCommitsNavigatorWidget} from "../../widgets/accountHierarchy";
import {VizRow, VizItem} from "../../containers/layout";
import {week_to_date} from "../../../../helpers/utility";
import moment from 'moment';


const CumulativeCommitCountDetailPanels = (
  {
    cumulativeCommitCounts,
    context,
    dimension,
    instanceKey,
    detailViewCommitsGroupBy,
    days,
    before,
    selectedCommits,
    view,
    onAreaChartSelectionChange,
    onCommitTimelineSelectionChange
  }
) => {
  return (
    <React.Fragment>
      <VizRow h={"70%"}>
        <VizItem w={"40%"}>
          <CumulativeCommitCountChart
            cumulativeCommitCounts={cumulativeCommitCounts}
            context={context}
            view={view}
            onSelectionChange={onAreaChartSelectionChange}
            zoomTriggersSelection={false}
          />
        </VizItem>

        <VizItem w={"60%"}>
          <DimensionCommitsNavigatorWidget
            dimension={dimension}
            instanceKey={instanceKey}
            context={context}
            view={view}
            days={days}
            before={before}
            groupBy={detailViewCommitsGroupBy}
            onSelectionChange={onCommitTimelineSelectionChange}
          />
        </VizItem>
      </VizRow>
      <VizRow h={"30%"}>
        <VizItem w={"100%"}>
          {
            selectedCommits ?
              <CommitsTimelineTable commits={selectedCommits}/>
              :
              <DimensionCommitsNavigatorWidget
                dimension={dimension}
                instanceKey={instanceKey}
                context={context}
                view={view}
                days={days}
                before={before}
                groupBy={detailViewCommitsGroupBy}
                display={'table'}
              />
          }
        </VizItem>

      </VizRow>
    </React.Fragment>
  )
};

export class CumulativeCommitCountDetailView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      areaChartSelections: null,
      commitTimelineSelections: null,
    }
  }

  onAreaChartSelectionChange(selections) {
    this.setState((state, props) => (
      {
        areaChartSelections: selections,
        commitTimelineSelections: null,
      }
    ));
  }



  onCommitTimelineSelectionChange(selections) {
    this.setState((state, props) => (
      {
        areaChartSelections: state.areaChartSelections,
        commitTimelineSelections: selections
      }
    ));
  }

  getSelectionDateRange(selections) {
    return selections.reduce(
      (range, point) => (
        {
          start: range.start.isAfter(point.weekDate) ? point.weekDate : range.start,
          end: range.end.isBefore(point.weekDate) ? point.weekDate : range.end
        }
      ), {
        start: selections[0].weekDate,
        end: selections[0].weekDate
      })
  }

  render() {
    let days = 7;
    let before = null;
    const selections = this.state.areaChartSelections
    if (selections && selections.length > 0) {
      if (selections.length === 1) {
        before = moment(selections[0].weekDate).add(7, 'days').valueOf();
      } else {
        const {start, end} = this.getSelectionDateRange(selections);
        before = moment(end).add(7, 'days').valueOf();
        days = before.diff(start, 'days');
      }

    }
    return (
      <CumulativeCommitCountDetailPanels
        days={days}
        before={before}
        selectedCommits={this.state.commitTimelineSelections}
        onAreaChartSelectionChange={this.onAreaChartSelectionChange.bind(this)}
        onCommitTimelineSelectionChange={this.onCommitTimelineSelectionChange.bind(this)}
        {...this.props}
      />
    )
  }

}