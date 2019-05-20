import React from 'react';

import {Table} from 'antd';

import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from '../../../services/graphql';
import {withAntPagination} from "../../../components/graphql/withAntPagination";


const {Column} = Table;

const AllAccountsPaginatedTable = ({paging, pageSize, currentCursor, onNewPage, reload}) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query allAccounts($pageSize: Int!, $endCursor: String) {
          allAccounts (first: $pageSize, after: $endCursor){
                count
                edges {
                    node {
                        id
                        name
                        key
                        created
                    }
                }
            }
      }
  `
    }
    variables={{
      pageSize: pageSize,
      endCursor: currentCursor
    }}
    fetchPolicy={reload ? 'network-only' : 'cache-first'}
  >
    {
      ({loading, error, data}) => {
        if (error) return null;
        let tableData = [];
        let totalItems = 0;
        if (!loading) {
          tableData = data.allAccounts.edges.map(edge => edge.node);
          totalItems = data.allAccounts.count;
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
            <Column title={"Key"} dataIndex={"key"} key={"key"}/>
            <Column title={"Created"} dataIndex={"created"} key={"created"}/>
          </Table>
        )
      }
    }
  </Query>
)


export const AllAccountsTableWidget = withViewerContext(withAntPagination(AllAccountsPaginatedTable), ['admin'])