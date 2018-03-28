import type {Props} from "../types";
import React from 'react';
import {formatPolarisTimestamp} from "../../../../helpers/utility";
import {Table} from "../../containers/table";

export const ActivitySummaryTable = (props: Props) => {
  const tableData = props.selectedActivities || props.viz_domain.data.filter(activitySummary => activitySummary.activity_level.visible);

  return (
    <Table
      data={tableData.sort((a, b) => b.activity_level.priority - a.activity_level.priority)}
      columns={[{
        id: 'col-activity-level',
        Header: 'Activity Level',
        headerStyle: {width: '50px'},
        accessor: activitySummary => activitySummary.activity_level.color,

        Cell: row => (
          <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: row.value,
            borderRadius: '2px'
          }}>
          </div>
        )
      }, {
        id: 'col-entity-name',
        Header: `${props.viz_domain.level}`,
        accessor: 'entity_name',
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
        Header: `Timespan (${props.viz_domain.span_uom}`,
        accessor: 'span',
      }]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
  )
};