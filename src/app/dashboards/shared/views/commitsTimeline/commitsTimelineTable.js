import React from 'react';
import {Table} from "../../containers/table/index";
import {injectIntl} from 'react-intl';
import moment from 'moment';
import {FileTypesSummaryChart} from "../fileTypesSummary/fileTypesSummaryChart";
import {CommitLinesSummaryChart} from "../../../commits/views/commitLinesSummaryChart";
import {Flex, Box} from "reflexbox";
import {url_for_instance} from "../../../../framework/navigation/context/helpers";
import Commits from "../../../commits/context";
import Contributors from "../../../contributors/context";

import {Link} from "react-router-dom";
import {WithCommit} from "../../../commits/withCommit";

import {capitalizeFirstLetter, toMoment} from "../../../../helpers/utility";
import {replace_url_with_links} from "../../../commits/views/commitDetails";
import {CommitMessage} from "../../../commits/views/commitMessage";
import {queueTime} from "../../helpers/commitUtils";

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
        id: 'commit-date',
        Header: `Commit Date`,
        accessor: commit => `${toMoment(commit.commitDate).format('MM/DD/YYYY HH:mm')}`,
        maxWidth: 140,
      }, {
        id: 'author-date',
        Header: `Author Date`,
        maxWidth: 140,
        accessor: commit => `${toMoment(commit.authorDate).format('MM/DD/YYYY HH:mm')}`,
      },{
        id: 'queue-time',
        Header: `Queue Time`,
        filterable:false,
        accessor: commit => `${queueTime(commit)}`,
        maxWidth: 100,
      }, {
        id: 'file-change-chart',
        Header: 'Files',
        filterable: false,
        accessor: commit => commit.key,

        Cell: row => {
          return (
            <WithCommit
              commitKey={row.value}
              render={
                ({commit}) => <FileTypesSummaryChart fileCount={commit.stats.files}
                                                     fileTypesSummary={commit.fileTypesSummary}/>
              }
            />

          )
        },
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              height: "80px"
            }
          };
        },
        maxWidth: 150
      }, {
        id: 'line-change-chart',
        Header: 'Lines',
        filterable: false,
        accessor: commit => commit,
        Cell: row => {
          return (

            <CommitLinesSummaryChart showTotal minHeight={30} key={row.value.name} commit={row.value}/>
          )
        },
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              height: "80px"
            }
          };
        },
        maxWidth: 150
      }, {
        id: 'message',
        Header: "Commit Message",
        accessor: 'commitMessage',
        filterMethod: (filter, row) =>
          row[filter.id].includes(filter.value),
        Cell: row => (
          <CommitMessage
            message={row.value}
          />
        ),
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              overflow: "auto"
            }
          };
        },
      }]}
      showPageSizeOptions={false}
      showPageJump={false}
      defaultPageSize={1}
      previousText={">"}
      nextText={"<"}
      getPaginationProps={
        () => ({
          pageText: 'Commit'
        })
      }
      defaultSorted={[
        {
          id: 'commit-date',
          desc: true
        },
        {
          id: 'author-date',
          desc: true
        }
      ]}
      getTrProps={(state, rowInfo, column) => {
        return {
          style: {
            height: "100px",
            overflow: "auto"
          }
        };
      }}
      className="-striped -highlight"
    />
  )
});