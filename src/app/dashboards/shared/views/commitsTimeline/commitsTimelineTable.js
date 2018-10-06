import React from 'react';
import {Table} from "../../containers/table/index";
import {injectIntl} from 'react-intl';
import moment from 'moment';
import {FileTypesSummaryChart} from "../fileTypesSummary/fileTypesSummaryChart";
import {CommitLinesChart} from "../../../commits/views/commitLineSummary";
import {capitalizeFirstLetter} from "../../../../helpers/utility";
import {Flex} from "reflexbox";
import {replace_url_with_links} from "../../../commits/views/commitDetails";
import {url_for_instance} from "../../../../framework/navigation/context/helpers";
import Commits from "../../../commits/context";
import Contributors from "../../../contributors/context";

import {Link} from "react-router-dom";

export const CommitsTimelineTable = injectIntl((props: Props) => {
  const tableData = props.commits;
  return (
    <Table
      filterable
      data={tableData}
      columns={[{
        id: 'SHA',
        Header: `SHA`,
        accessor: commit => commit,
        maxWidth: 75,
        Cell: row => (
          <Link to={url_for_instance(Commits, row.value.name, row.value.key)} title={"View commit details"}>
            {row.value.name}
          </Link>
        )
      }, {
        id: 'author',
        Header: `Author`,
        accessor: commit => commit,
        maxWidth: 100,
        Cell: row => (
          <Link to={url_for_instance(Contributors, row.value.author, row.value.authorKey)} title={"Go to author"}>
            {row.value.author}
          </Link>
        )
      }, {
        id: 'commitDate',
        Header: `Commit Date`,
        accessor: commit => `${moment(commit.commitDate).format('MM/DD/YYYY hh:mm')}`,
        maxWidth: 200,
      }, {
        Header: 'Files',
        id: 'file-count',
        filterable: false,
        accessor: commit => commit.stats.files,
        maxWidth: 75
      }, {
        id: 'line-change-chart',
        Header: 'Lines',
        filterable: false,
        accessor: commit => commit,
        Cell: row => {
          return (
            <CommitLinesChart minHeight={30}  key={row.value.name} commit={row.value}/>
          )
        },
        maxWidth: 150
      }, {
        id: 'message',
        Header: "Commit Message",
        accessor: 'commitMessage',
        filterMethod: (filter, row) =>
          row[filter.id].includes(filter.value),
        Cell: row => (
          <Flex style={{overflowY: 'auto'}}>
              {row.value}
          </Flex>
        )

      }]}
      showPageSizeOptions={false}
      showPageJump={false}
      defaultPageSize={1}
      className="-striped -highlight"
    />
  )
});