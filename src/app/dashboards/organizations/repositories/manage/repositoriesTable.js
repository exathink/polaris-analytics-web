import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import {Table} from 'antd';

import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {analytics_service} from '../../../../services/graphql';
import {withAntPagination} from "../../../../components/graphql/withAntPagination";


const {Column} = Table;

const RepositoriesPaginatedTable = ({organizationKey, pageSize, currentCursor, onNewPage}) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query organizationRepositories($organizationKey: String!, $pageSize: Int!, $endCursor: String) {
        organization(key: $organizationKey) {
            id
            repositories (first: $pageSize, after: $endCursor, interfaces: [CommitSummary]){
                  count
                  edges {
                      node {
                          id
                          name
                          key
                          description
                          earliestCommit
                          latestCommit
                          commitCount
                      }
                  }
              }
         }
        }
  `
    }
    variables={{
      organizationKey: organizationKey,
      pageSize: pageSize,
      endCursor: currentCursor
    }}
    fetchPolicy={'cache-and-network'}

  >
    {
      ({loading, error, data}) => {
        if (error) return null;
        let tableData = [];
        let totalItems = 0;
        if (!loading) {
          tableData = data.organization.repositories.edges.map(edge => edge.node);
          totalItems = data.organization.repositories.count;
        }
        return (
          <Table
            dataSource={tableData}
            loading={loading}
            rowKey={record => record.id}
            pagination={{
              total: totalItems,
              defaultPageSize: pageSize,
              hideOnSinglePage: true,
              showTotal: total => `${total} Repositories`

            }}
            onChange={onNewPage}
          >
            <Column title={"Name"} dataIndex={"name"} key={"name"}/>
            <Column title={"Commit Count"} dataIndex={"commitCount"} key={"commitCount"}/>
            <Column title={"Earliest Commit"} dataIndex={"earliestCommit"} key={"earliestCommit"}/>
            <Column title={"Latest Commit"} dataIndex={"latestCommit"} key={"latestCommit"}/>
            <Column title={"Description"} dataIndex={"description"} key={"description"}/>
          </Table>
        )
      }
    }
  </Query>
)


export const RepositoriesTableWidget = withViewerContext(withAntPagination(RepositoriesPaginatedTable, 8))