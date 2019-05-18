import React from 'react';

import {Table} from 'antd';

import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Loading} from "../../../components/graphql/loading";
import {analytics_service} from '../../../services/graphql';

const { Column, ColumnGroup } = Table;


const AllAccountsTable = () => (
  <Query
    client={analytics_service}
    query={
      gql`
        query allAccounts {
          allAccounts (first: 20){
            count
            edges{
              node{
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
  >
    {
      ({loading, error, data}) => {
        if (loading) return <Loading/>;
        if (error) return null;
        const tableData = data.allAccounts.edges.map(edge => edge.node);
        const totalItems = data.allAccounts.count;
        return (
          <Table
            dataSource={tableData}
            pagination={{
              total: tableData.length,
              defaultPageSize: 10,
              hideOnSinglePage: true
            }}>
            <Column title={"Name"} dataIndex={"name"} key={"name"}/>
            <Column title={"Key"} dataIndex={"key"} key={"key"}/>
            <Column title={"Created"} dataIndex={"created"} key={"created"}/>
          </Table>
        )
      }
    }
  </Query>
);

export const AllAccountsTableWidget = withViewerContext(AllAccountsTable, ['admin'])