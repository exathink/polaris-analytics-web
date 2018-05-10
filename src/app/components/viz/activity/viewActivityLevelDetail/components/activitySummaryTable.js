import type {Props} from "../domain";
import React from 'react';
import {formatPolarisTimestamp} from "../../../../../helpers/utility";
import {Table} from "../../../containers/table/index";
import {findVisibleLevels} from "../activityLevel";
import Button from "../../../../../../components/uielements/button";

export const ActivitySummaryTable = (props: Props) => {
  const tableData = props.selectedActivities || findVisibleLevels(props.viz_domain.data);
  const drillDown = (event) => {
    if (props.viz_domain.onDrillDown) {
      props.viz_domain.onDrillDown(event)
    }
  };

  return (
    <Table
      data={tableData.sort((a, b) => b.activity_level.index - a.activity_level.index)}
      columns={[{
        id: 'col-activity-level',
        Header: `${props.viz_domain.subject_label_long}`,
        headerStyle: {width: '50px'},
        accessor: activitySummary => ({
          color: activitySummary.activity_level.color,
          text: activitySummary.entity_name,
          key: activitySummary.id
        }),
        Cell: row => (
          <Button onClick={() => drillDown({
            subject_label: `${props.viz_domain.subject_label}` ,
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
        Header: `Commits`,
        accessor: 'commit_count',
      }, {
        Header: `Contributors`,
        accessor: 'contributor_count',
      }, {
        id: 'earliest-commit-col',
        Header: `Earliest Commit`,
        accessor: activitySummary => formatPolarisTimestamp(activitySummary.earliest_commit),
      }, {
        id: 'latest-commit-col',
        Header: `Latest Commit`,
        accessor: activitySummary => formatPolarisTimestamp(activitySummary.latest_commit),
      }, {
        id: 'timespan-col',
        Header: `Timespan (${props.viz_domain.span_uom})`,
        accessor: activitySummary => activitySummary.span.toLocaleString(),
      }
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
  )
};