import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import {CompactTable} from "../../../../components/tables";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {analytics_service} from '../../../../services/graphql';
import {withAntPagination} from "../../../../components/graphql/withAntPagination";
import {getActivityLevelFromDate} from "../../../shared/helpers/activityLevel";
import Button from "../../../../../components/uielements/button";
import {ButtonBar} from "../../../../containers/buttonBar/buttonBar";
import {RepositoryLink} from "../../../shared/navigation/repositoryLink";
import {fromNow, human_span} from "../../../../helpers/utility";

const {Column} = CompactTable;

const RepositoriesPaginatedTable = ({organizationKey, pageSize, currentCursor, onNewPage}) => (
  <Query
    client={analytics_service}
    query={
      gql`
      query organizationRepositories($organizationKey: String!, $pageSize: Int!, $endCursor: String) {
        organization(key: $organizationKey) {
            id
            repositories (first: $pageSize, after: $endCursor, interfaces: [CommitSummary, ContributorCount]){
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
                          contributorCount
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
          <CompactTable
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
            <Column
              title={"Name"}
              dataIndex={"name"}
              key={"name"}
              render={
                (name, record) =>
                  <RepositoryLink
                    repositoryName={record.name}
                    repositoryKey={record.key}
                  >
                    {name}
                  </RepositoryLink>
              }
            />
            <Column title={"Commits"} dataIndex={"commitCount"} key={"commitCount"}/>
            <Column title={"Contributors"} dataIndex={"contributorCount"} key={"contributorCount"}/>
            <Column
              title={"History"}
              dataIndex={"earliestCommit"}
              key={"earliestCommit"}
              render={
                (_, record) => human_span(record.latestCommit, record.earliestCommit)
              }
            />
            <Column
              title={"Latest Commit"}
              dataIndex={"latestCommit"}
              key={"latestCommit"}
              render={
                (latestCommit) => fromNow(latestCommit)
              }
            />
            <Column
              title={"Status"}
              dataIndex={"latestCommit"}
              key={"activityProfile"}
              render={
                (latestCommit) => getActivityLevelFromDate(latestCommit).display_name
              }
            />
            <Column
              key={"actions"}
              width={80}
              render={
                (name, record) =>
                  <ButtonBar>
                    <RepositoryLink
                      repositoryName={record.name}
                      repositoryKey={record.key}
                    >
                      <Button
                        type={'primary'}
                        size={'small'}
                      >
                        Select
                      </Button>
                    </RepositoryLink>
                  </ButtonBar>
              }
            />


          </CompactTable>
        )
      }
    }
  </Query>
)


export const RepositoriesTableWidget = withViewerContext(withAntPagination(RepositoriesPaginatedTable, 7))