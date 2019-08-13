import React from 'react';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {OrganizationDashboard} from "../organizationDashboard";
import {ProjectsTableWidget} from "./manage/projectsTable";

import Projects from "../../projects/context"
import {Col, Icon, Row} from "antd";
import Button from "../../../../components/uielements/button";

import {IconCard} from "../../../components/cards/iconCard";

const dashboard_id = 'dashboards.projects.organization.instance';


export default () => (
  <OrganizationDashboard
    pollInterval={60 * 1000}
    render={
      ({organization, context, lastRefresh}) => (
        organization.projectCount > 0 ?
          <Dashboard
            dashboard={`${dashboard_id}`}
          >
            <DashboardRow
              h='22%'
              title={"Projects"}
              controls={[
                () =>
                  <Button type="primary" onClick={() => context.go('.', 'new')}>
                    <Icon type="plus"/> New Project
                  </Button>
              ]}
            >
              <DashboardWidget
                w={1 / 2}
                name="project-activity-levels"
                render={
                  ({view}) =>
                    <ChildDimensionActivityProfileWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      childDimension={'projects'}
                      context={context}
                      childContext={Projects}
                      enableDrillDown={true}
                      view={view}
                      referenceDate={lastRefresh}
                      referenceCount={organization.workItemsSourceCount}
                    />
                }
                showDetail={true}
              />
              <DashboardWidget
                w={1 / 2}
                name="most-active-projects"
                render={
                  ({view}) =>
                    <DimensionMostActiveChildrenWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      childConnection={'recentlyActiveProjects'}
                      context={context}
                      childContext={Projects}
                      top={10}
                      latestCommit={organization.latestCommit}
                      days={1}
                      view={view}
                    />
                }
                showDetail={true}
              />
            </DashboardRow>
            <DashboardRow h={"68%"}>
              <DashboardWidget
                w={1}
                name="projects"
                render={
                  () =>
                    <ProjectsTableWidget
                      organizationKey={organization.key}
                    />
                }
                showDetail={false}
              />
            </DashboardRow>


          </Dashboard>
          :
          <NoProjectsView context={context}/>
      )
    }/>
);

const NoProjectsView = ({context}) => (
  <div className={'no-data-landing'}>
    <div style={{padding: '30px'}}>
      <Row gutter={16}>
        <Col offset={10} span={24}>
          <a onClick={() => context.go('.', 'new')}>
            <IconCard icon={Projects.icon} title={"Import Projects"}/>
          </a>
        </Col>
      </Row>
    </div>

  </div>
);

