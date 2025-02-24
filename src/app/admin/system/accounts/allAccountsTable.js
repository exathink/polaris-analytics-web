import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"

import React from 'react';

import {Table} from 'antd';

import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {analytics_service} from '../../../services/graphql';
import {withAntPagination} from "../../../components/graphql/withAntPagination";


const {Column} = Table;

const AllAccountsPaginatedTable = ({paging, pageSize, currentCursor, onNewPage, newData}) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query allAccounts($pageSize: Int!, $endCursor: String) {
          allAccounts (first: $pageSize, after: $endCursor, interfaces: [UserInfo, OwnerInfo]){
                count
                edges {
                    node {
                        id
                        name
                        key
                        ownerKey
                        email
                        firstName
                        lastName
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
    fetchPolicy={newData ? 'network-only' : 'cache-first'}
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
            <Column title={"Owner"} dataIndex={"email"} key={"email"}/>
          </Table>
        )
      }
    }
  </Query>
)


export const AllAccountsTableWidget = withViewerContext(withAntPagination(AllAccountsPaginatedTable), ['admin'])