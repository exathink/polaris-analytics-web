import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {OrganizationDashboard} from "../organizationDashboard";
import {RepositoriesTableWidget} from "./manage/repositoriesTable";

import Repositories from "../../repositories/context";
import Button from "../../../../components/uielements/button";
import {RepositoriesDashboardSetup} from "./setup";

const dashboard_id = 'dashboards.activity.organization.instance';

const TopDashboard =  () => (
  <OrganizationDashboard
    pollInterval={60 * 1000}
    render={(
      {organization, context, lastRefresh}) => (
        organization.repositoryCount > 0 ?
          <Dashboard
            dashboard={`${dashboard_id}`}
          >
            <DashboardRow
              h='22%'
              title={"Repositories"}
              controls={[
                () =>
                  <Button type="primary" onClick={() => context.go('.', 'new')}>
                    <DownloadOutlined /> Connect Repositories
                  </Button>
              ]}
            >
              <DashboardWidget
                w={1 / 2}
                name="respository-activity-levels"
                render={
                  ({view}) =>
                    <ChildDimensionActivityProfileWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      childDimension={'repositories'}
                      context={context}
                      childContext={Repositories}
                      enableDrillDown={true}
                      view={view}
                      referenceDate={lastRefresh}
                      referenceCount={organization.commitCount}
                    />
                }
                showDetail={true}
              />
              <DashboardWidget
                w={1 / 2}
                name="most-active-repositories"
                render={
                  ({view}) =>
                    <DimensionMostActiveChildrenWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      childConnection={'recentlyActiveRepositories'}
                      context={context}
                      childContext={Repositories}
                      top={10}
                      latestCommit={organization.latestCommit}

                      days={1}
                      view={view}
                    />
                }
                showDetail={true}
              />
            </DashboardRow>
            <DashboardRow
              h={"68%"}
            >
              <DashboardWidget
                w={1}
                name="repositories"
                render={
                  () =>
                    <RepositoriesTableWidget
                      organizationKey={organization.key}
                    />
                }
                showDetail={false}
              />
            </DashboardRow>
          </Dashboard>
          :
          <RepositoriesDashboardSetup context={context}/>
    )}
  />
);

export default TopDashboard;
