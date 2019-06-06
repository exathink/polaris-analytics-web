import React from 'react';

import {Table} from 'antd';

import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from '../../../../services/graphql';
import {withAntPagination} from "../../../../components/graphql/withAntPagination";


const {Column} = Table;

const ProjectsPaginatedTable = ({organizationKey, paging, pageSize, currentCursor, onNewPage, newData}) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query organizationProjects($organizationKey: String!, $pageSize: Int!, $endCursor: String) {
        organization(key: $organizationKey) {
            projects (first: $pageSize, after: $endCursor){
                  count
                  edges {
                      node {
                          id
                          name
                          key
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
    fetchPolicy={newData ? 'network-only' : 'cache-first'}
  >
    {
      ({loading, error, data}) => {
        if (error) return null;
        let tableData = [];
        let totalItems = 0;
        if (!loading) {
          tableData = data.organization.projects.edges.map(edge => edge.node);
          totalItems = data.organization.projects.count;
        }
        return (
          <Table
            dataSource={tableData}
            loading={loading}
            rowKey={record => record.id}
            pagination={{
              total: totalItems,
              defaultPageSize: pageSize,
              hideOnSinglePage: true

            }}
            onChange={onNewPage}
          >
            <Column title={"Name"} dataIndex={"name"} key={"name"}/>
          </Table>
        )
      }
    }
  </Query>
)


export const ProjectsTableWidget = withViewerContext(withAntPagination(ProjectsPaginatedTable))