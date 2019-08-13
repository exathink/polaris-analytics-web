import React from 'react';
import {Card, Col, Icon, Row} from "antd";
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {OrganizationDashboard} from "../organizationDashboard";
import {RepositoriesTableWidget} from "./manage/repositoriesTable";

import Repositories from "../../repositories/context";
import Button from "../../../../components/uielements/button";
import {IconCard} from "../../../components/cards/iconCard";
import Projects from "../../projects/context";

const dashboard_id = 'dashboards.activity.organization.instance';

export default () => (
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
                    <Icon type="download"/> Import Repositories
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
          <NoRepositoriesView context={context}/>
    )}
  />
);

const NoRepositoriesView = ({context}) => (
  <div className={'no-projects'}>
    <div style={{padding: '30px'}}>
      <Row gutter={16}>
        <Col offset={10} span={24}>
          <a onClick={() => context.go('.', 'new')}>
            <Card
              hoverable={true}
              bordered={true}
              title={"Import Repositories"}
              cover={
                <img
                  alt="example"
                  src="/images/third-party/git-logomark-black@2x.png"
                />
              }
              style={{width: 300, marginTop: 100}}
              actions={[

                <Icon type="download" key="edit"/>,

              ]}
            >
            </Card>
          </a>
        </Col>
      </Row>
    </div>

  </div>
);