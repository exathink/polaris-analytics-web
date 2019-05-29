import React from 'react';

import {Table} from 'antd';

import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {analytics_service} from '../../../../services/graphql';
import {withAntPagination} from "../../../../components/graphql/withAntPagination";


const {Column} = Table;

const AccountUsersPaginatedTable = (
  {
    view,
    viewerContext:{ viewer },
    paging,
    pageSize,
    currentCursor,
    onNewPage,
    newData
  }) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query accountUsers($accountKey: String!, $pageSize: Int!, $endCursor: String) {
          account(key: $accountKey) {
            id
            key
            users(first: $pageSize, after: $endCursor, interfaces:[UserInfo, ScopedRole]) {
              count
              edges {
               node {
                  id
                  name
                  key
                  email
                  role
               }
              }
            }
          }
      }
  `
    }
    variables={{
      pageSize: pageSize,
      endCursor: currentCursor,
      accountKey: viewer.accountKey
    }}
    fetchPolicy={newData ? 'network-only' : 'cache-first'}
  >
    {
      ({loading, error, data}) => {
        if (error) return null;
        let tableData = [];
        let totalItems = 0;
        if (!loading) {
          tableData = data.account.users.edges.map(edge => edge.node);
          totalItems = data.account.users.count;
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
            <Column title={"Email"} dataIndex={"email"} key={"email"}/>
            <Column title={"Role"} dataIndex={"role"} key={"role"}/>
          </Table>
        )
      }
    }
  </Query>
)

export const AccountUsersTableWidget = withViewerContext(withAntPagination(AccountUsersPaginatedTable), ['account-owner'])