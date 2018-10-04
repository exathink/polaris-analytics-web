import React from 'react';
import {DashboardRow} from "../../../../framework/viz/dashboard";
import {CumulativeCommitCountChart} from "./index";
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
    view,
    onAreaChartSelectionChange
  }
) => {
  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={"40%"}>
          <CumulativeCommitCountChart
            cumulativeCommitCounts={cumulativeCommitCounts}
            context={context}
            view={view}
            onSelectionChange={onAreaChartSelectionChange}
            zoomTriggersSelection={false}
            chartId={'history'}
            cacheViewState={true}
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
            chartId={`${instanceKey}${before}${days}`}
            cacheViewState={true}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};

export class CumulativeCommitCountDetailView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      areaChartSelections: null
    }
  }

  onAreaChartSelectionChange(selections) {
    this.setState((state, props) => (
      {
        areaChartSelections: selections
      }
    ))
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
        before = selections[0].weekDate.add(7, 'days');
      } else {
        const {start, end} = this.getSelectionDateRange(selections);
        before = moment(end).add(7, 'days');
        days = before.diff(start, 'days');
      }

    }
    return (
      <CumulativeCommitCountDetailPanels
        days={days}
        before={before}
        {...this.props}
        onAreaChartSelectionChange={this.onAreaChartSelectionChange.bind(this)}
      />
    )
  }

}