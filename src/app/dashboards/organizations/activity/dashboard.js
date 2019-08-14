import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";
import {OrganizationDashboard} from '../organizationDashboard';
import Projects from "../../projects/context";
import Repositories from "../../repositories/context";
import Contributors from "../../contributors/context";
import {Card, Col, Icon, Row} from "antd";
import {ImportProjectsCard} from "../../../components/cards/importProjectCard";
import {ImportRepositoriesCard} from "../../../components/cards/importRepositoriesCard";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};


export const dashboard = () => (
  <OrganizationDashboard
    pollInterval={60 * 1000}
    render={
      ({organization, context}) =>
        organization.projectCount > 0 && organization.repositoryCount > 0 ?
          <Dashboard
            dashboard={`${dashboard_id}`}
          >
            <DashboardRow h='15%'>
              <DashboardWidget
                w={1}
                name="activity-summary"
                title={messages.topRowTitle}
                render={
                  () =>
                    <DimensionActivitySummaryPanelWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                    />
                }
              />
            </DashboardRow>
            <DashboardRow h={"22%"}>
              <DashboardWidget
                w={organization.projectCount > 0 ? 1 / 3 : 1 / 2}
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
              <DashboardWidget
                w={organization.projectCount > 0 ? 1 / 3 : 1 / 2}
                name="most-active-contributors"
                render={
                  ({view}) =>
                    <DimensionMostActiveChildrenWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      childConnection={'recentlyActiveContributors'}
                      context={context}
                      childContext={Contributors}
                      top={10}
                      latestCommit={organization.latestCommit}
                      days={1}
                      view={view}
                    />
                }
                showDetail={true}
              />
              {
                organization.projectCount > 0 ?
                  <DashboardWidget
                    w={1 / 3}
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
                  :
                  null
              }
            </DashboardRow>
            <DashboardRow h={"59%"}>
              <DashboardWidget
                w={1}
                name="commits"
                title={"Contributions"}
                render={
                  ({view}) =>
                    <DimensionCommitsNavigatorWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      context={context}
                      view={view}
                      days={1}
                      latestCommit={organization.latestCommit}
                      markLatest
                      groupBy={'repository'}
                      groupings={['repository', 'author', 'workItem']}
                      showHeader
                      showTable
                    />
                }
                showDetail={true}
              />
            </DashboardRow>
          </Dashboard>
          :
          <NoDataLandingView organization={organization} context={context}/>
    }
  />
);
export default dashboard;


const NoDataLandingView = ({organization, context}) => {
  const noProjects = organization.projectCount === 0;
  const noRepositories = organization.repositoryCount === 0;

  return (
    <div className={'no-repositories'}>

      <div style={{padding: '30px'}}>
        <Row>
          <Col offset={6} span={12}>
            <h1>Setup Organization {organization.name}</h1>
            <p>
              To view activity for this organization, you must import project data from a work tracking system
               that you use to manage your engineering projects, and commit data from from a Git based version control system.
              The process is simple and should take under 30 minutes in most cases. You may import project and commit data in any order.
            </p>
            <p>
              Once the initial data import is complete, Urjuna will
              keep your data updated automatically in real-time.
            </p>
          </Col>
        </Row>
        <Row gutter={16}>
          {
            noProjects &&
              <Col offset={6} span={6}>
                <ImportProjectsCard onClick={() => context.go('..', 'projects')}/>
              </Col>
          }
          {
            noRepositories &&
            <Col span={12}>
              <ImportRepositoriesCard onClick={() => context.go('..', 'repositories')}/>
            </Col>
          }

        </Row>
      </div>

    </div>

  )
}