import type {Props} from "../model";
import React from 'react';
import {Table} from "../../../containers/table/index";
import {findVisibleLevels} from "../../../helpers/activityLevel";
import Button from "../../../../../../components/uielements/button";
import {formatDateTime} from "../../../../../i18n/utils";
import {displaySingular, formatTerm, displayPlural} from "../../../../../i18n/index";
import {injectIntl} from 'react-intl';

export const ActivityLevelsTable = injectIntl((props: Props) => {
  const tableData = props.selectedActivities || findVisibleLevels(props.model.data);
  const drillDown = (event) => {
    if (props.onDrillDown) {
      props.onDrillDown(event)
    }
  };
  const {intl, model} = props;
  const childContextName = displaySingular(intl, model.childContext);

  return (
    <Table
      data={tableData.sort((a, b) => b.activity_level.index - a.activity_level.index)}
      columns={[{
        id: 'col-activity-level',
        Header: `${childContextName}`,
        headerStyle: {width: '50px'},
        accessor: activitySummary => ({
          color: activitySummary.activity_level.color,
          text: activitySummary.entity_name,
          key: activitySummary.id
        }),
        Cell: row => (
          <Button onClick={() => drillDown({
            subject_label: `${childContextName}` ,
            entity_name: row.value.text,
            id: row.value.key
          })} style={{
            width: "100%",
            height: "100%",
            backgroundColor: row.value.color,
            borderRadius: '2px'
          }}>
            {row.value.text}
          </Button>
        )

      }, {
        id: 'commit-count',
        Header: `${formatTerm(intl, 'Commits')}`,
        accessor: 'commit_count',
      },{
        id: 'timespan-col',
        Header: `${formatTerm(intl, 'History')} (${props.model.span_uom})`,
        accessor: activitySummary => intl.formatNumber(activitySummary.span),
      }, {
        id: 'earliest-commit-col',
        Header: `${formatTerm(intl, 'Earliest Commit')}`,
        accessor: activitySummary => activitySummary.earliest_commit,
        Cell: row => formatDateTime(intl,row.value)
      },{
        id: 'latest-commit-col',
        Header: `${formatTerm(intl, 'Latest Commit')}`,
        accessor: activitySummary => activitySummary.latest_commit,
        Cell: row => formatDateTime(intl,row.value)
      },{
        Header: model.secondaryMeasureContext ? `${displayPlural(intl, model.secondaryMeasureContext)}` : '',
        accessor: 'secondary_measure',
        show: model.secondaryMeasureContext != null

      },
      ]}
      defaultPageSize={4}
      showPageSizeOptions={false}
      defaultSorted={[
        {
          id: 'commit-count',
          desc: true
        },
        {
          id: 'timespan-col',
          desc: true
        }
      ]}

      className="-striped -highlight"
    />
  )
});