import {gql} from "@apollo/client";
import {Query} from "@apollo/client/react/components"
import React from 'react';

import {analytics_service} from '../../../../services/graphql';

import {CompactTable} from "../../../../components/tables";
import {withAntPagination} from "../../../../components/graphql/withAntPagination";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {ProjectLink} from "../../../shared/navigation/projectLink";
import {fromNow} from "../../../../helpers/utility";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import Button from "../../../../../components/uielements/button";

const {Column} = CompactTable;

const ProjectsPaginatedTable = ({organizationKey, paging, pageSize, currentCursor, onNewPage, newData}) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query organizationProjects($organizationKey: String!, $pageSize: Int!, $endCursor: String) {
        organization(key: $organizationKey) {
            id
            projects (first: $pageSize, after: $endCursor, interfaces: [CommitSummary, RepositoryCount, WorkItemEventSpan]){
                  count
                  edges {
                      node {
                          id
                          name
                          key
                          repositoryCount
                          latestCommit
                          latestWorkItemEvent
                          workItemsSources{
                            count
                          }


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
          tableData = data.organization.projects.edges.map(
            edge => ({
                ...edge.node,
                subProjectCount: edge.node.workItemsSources.count,
              }
            )
          );
          totalItems = data.organization.projects.count;
        }
        return (
          <CompactTable
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
            <Column
              title={"Name"}
              dataIndex={"name"}
              key={"name"}
              render={
                (name, record) =>
                  <ProjectLink
                    projectName={record.name}
                    projectKey={record.key}
                  >
                    {name}
                  </ProjectLink>
              }
            />
            <Column title={"Work Streams"} dataIndex={"subProjectCount"} key={"subProjectCountCount"}/>
            <Column title={"Repositories"} dataIndex={"repositoryCount"} key={"repositoryCount"}/>
            <Column
              title={"Last Commit"}
              dataIndex={"latestCommit"}
              key={"latestCommit"}
              render={
                (latestCommit) => fromNow(latestCommit)
              }
            />
            <Column
              title={"Last Project Activity"}
              dataIndex={"latestWorkItemEvent"}
              key={"latestActivity"}
              render={
                (latestActivity) => fromNow(latestActivity)
              }
            />
            <Column
              key={"actions"}
              width={80}
              render={
                (name, record) =>
                  <ButtonBar>
                    <ProjectLink
                      projectName={record.name}
                      projectKey={record.key}
                    >
                      <Button
                        type={'primary'}
                        size={'small'}
                      >
                        Select
                      </Button>
                    </ProjectLink>
                  </ButtonBar>
              }
            />

          </CompactTable>
        )
      }
    }
  </Query>
)


export const ProjectsTableWidget = withViewerContext(withAntPagination(ProjectsPaginatedTable))