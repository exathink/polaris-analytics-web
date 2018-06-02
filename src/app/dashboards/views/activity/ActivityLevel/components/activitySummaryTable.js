import type {Props} from "../model";
import React from 'react';
import {Table} from "../../../containers/table/index";
import {findVisibleLevels} from "../activityLevel";
import Button from "../../../../../../components/uielements/button";
import {formatDateTime} from "../../../../../i18n/utils";
import {displaySingular, i18n} from "../../../../../i18n/index";

export const ActivitySummaryTable = (props: Props) => {
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
        Header: `${i18n(intl, 'Commits')}`,
        accessor: 'commit_count',
      }, {
        Header: `${i18n(intl, 'Contributors')}`,
        accessor: 'contributor_count',
      }, {
        id: 'earliest-commit-col',
        Header: `${i18n(intl, 'Earliest Commit')}`,
        accessor: activitySummary => formatDateTime(intl,activitySummary.earliest_commit),
      }, {
        id: 'latest-commit-col',
        Header: `${i18n(intl, 'Latest Commit')}`,
        accessor: activitySummary => formatDateTime(intl, activitySummary.latest_commit),
      }, {
        id: 'timespan-col',
        Header: `${i18n(intl, 'History')} (${props.model.span_uom})`,
        accessor: activitySummary => intl.formatNumber(activitySummary.span),
      }
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
  )
};