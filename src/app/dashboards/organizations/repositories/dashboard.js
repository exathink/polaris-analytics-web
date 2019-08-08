import React from 'react';
import {Icon} from "antd";
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {OrganizationDashboard} from "../organizationDashboard";
import {RepositoriesTableWidget} from "./manage/repositoriesTable";

import Repositories from "../../repositories/context";
import Button from "../../../../components/uielements/button";

const dashboard_id = 'dashboards.activity.organization.instance';

export default () => (
  <OrganizationDashboard
    pollInterval={60*1000}
    render={(
      {organization, context, lastRefresh}) => (
      <Dashboard
        dashboard={`${dashboard_id}`}
      >
          <DashboardRow h={"70%"}>
            <DashboardWidget
              w={1}
              name="repositories"
              title={"Repositories"}
              controls={[
                () =>
                  <Button type="primary" onClick={()=>context.go('.', 'new')}>
                    <Icon type="plus"/> New Repository
                  </Button>
              ]}
              render={
                () =>
                  <RepositoriesTableWidget
                    organizationKey={organization.key}
                  />
              }
              showDetail={false}
            />
          </DashboardRow>
        <DashboardRow h='22%'>
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
                  pageSize={50}
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
      </Dashboard>
    )}
  />
);
