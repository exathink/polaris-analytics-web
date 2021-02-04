import React from 'react';
import {CumulativeCommitCountChart} from "./index";
import {DimensionCommitsNavigatorWidget} from "../../widgets/accountHierarchy";
import {VizRow} from "../../containers/layout";
import moment from 'moment';
import {Flex} from "reflexbox";
import uniqueStyles from './commitHistory.module.css';

const CumulativeCommitCountDetailPanels = (
  {
    cumulativeCommitCounts,
    context,
    dimension,
    instanceKey,
    detailViewGroupings,
    detailViewCommitsGroupBy,
    days,
    before,
    selectedCommits,
    view,
    showHeader,
    onAreaChartSelectionChange,
    referenceDate,
  }
) => {
  return (
    <React.Fragment>
      <VizRow h={"93%"}>
        <Flex column w={"30%"} h={1} className={uniqueStyles['viz-item']}>
          <CumulativeCommitCountChart
            cumulativeCommitCounts={cumulativeCommitCounts}
            context={context}
            view={view}
            onSelectionChange={onAreaChartSelectionChange}
            zoomTriggersSelection={false}
          />
        </Flex>

        <Flex column w={"70%"} h={1} className={uniqueStyles['viz-item']}>
          <DimensionCommitsNavigatorWidget
            dimension={dimension}
            instanceKey={instanceKey}
            context={context}
            view={view}
            days={days}
            before={before}
            shortTooltip={true}
            groupings={detailViewGroupings}
            groupBy={detailViewCommitsGroupBy}
            showHeader
            suppressHeaderDataLabels={3}
            referenceDate={referenceDate}
            showTable={true}
          />
        </Flex>
      </VizRow>

    </React.Fragment>
  )
};

export class CommitHistoryDetailView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      areaChartSelections: null,
    }
  }

  onAreaChartSelectionChange(selections) {
    this.setState((state, props) => (
      {
        areaChartSelections: selections,
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
        days = moment(before).diff(start, 'days');
      }

    }
    return (
      <CumulativeCommitCountDetailPanels
        days={days}
        before={before}
        selectedCommits={this.state.commitTimelineSelections}
        onAreaChartSelectionChange={this.onAreaChartSelectionChange.bind(this)}
        {...this.props}
      />
    )
  }

}