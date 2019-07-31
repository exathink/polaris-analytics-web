import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import {Table} from 'antd';

import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import {ArchiveProjectConfirmationModalButton} from "./archiveProjectConfirmationModal";

import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {analytics_service} from '../../../../services/graphql';
import {withAntPagination} from "../../../../components/graphql/withAntPagination";

const onProjectArchived = project => {
  // ToDo: Implement mutation to archive project
  console.log(project)
}

const ProjectsPaginatedTable = ({organizationKey, paging, pageSize, currentCursor, onNewPage}) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query organizationProjects($organizationKey: String!, $pageSize: Int!, $endCursor: String) {
        organization(key: $organizationKey) {
            id
            projects (first: $pageSize, after: $endCursor){
                  count
                  edges {
                      node {
                          id
                          name
                          key
                          repositoryCount
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
            <Table.Column title={"Name"} dataIndex={"name"} key={"name"} />

            {/* Repositories column is just for testing purposes */}
            <Table.Column title={"Repositories"} dataIndex={"repositoryCount"} key={"key"} />
            {/* Repositories column is just for testing purposes */}

            <Table.Column
              title=""
              width={80}
              key="select"
              render={
                (text, record) => {
                  return (
                    <ButtonBar>
                      <ArchiveProjectConfirmationModalButton
                        record={record}
                        onProjectArchived={onProjectArchived}
                      />
                    </ButtonBar>
                  )
                }
              }
            />
          </Table>
        )
      }
    }
  </Query>
)


export const ProjectsTableWidget = withViewerContext(withAntPagination(ProjectsPaginatedTable))