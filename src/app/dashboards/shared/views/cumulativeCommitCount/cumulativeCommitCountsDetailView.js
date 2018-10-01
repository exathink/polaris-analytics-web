import React from 'react';
import {DashboardRow} from "../../../../framework/viz/dashboard";
import {CumulativeCommitCountChart} from "./index";
import {DimensionCommitsNavigatorWidget} from "../../widgets/accountHierarchy";
import {VizRow, VizItem} from "../../containers/layout";
import {week_to_date} from "../../../../helpers/utility";

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
  const last = cumulativeCommitCounts.length > 0 ?
    cumulativeCommitCounts[cumulativeCommitCounts.length - 1]
    : null;


  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={"40%"}>
          <CumulativeCommitCountChart
            cumulativeCommitCounts={cumulativeCommitCounts}
            context={context}
            view={view}
            onSelectionChange={onAreaChartSelectionChange}
          />
        </VizItem>
        <VizItem w={"60%"}>
          <DimensionCommitsNavigatorWidget
            dimension={dimension}
            instanceKey={instanceKey}
            context={context}
            view={view}
            days={days}
            before={before? before.add(1, 'week') : (last ? week_to_date(last.year, last.week + 1) : null)}
            groupBy={detailViewCommitsGroupBy}

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
      (range, point) =>(
        {
          start: range.start.isAfter(point.weekDate) ? point.weekDate : range.start,
          end: range.end.isBefore(point.weekDate) ? point.weekDate: range.end
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
        before = selections[0].weekDate
      } else {
        const {start, end } = this.getSelectionDateRange(selections);
        before = end;
        days = end.diff(start, 'days');
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