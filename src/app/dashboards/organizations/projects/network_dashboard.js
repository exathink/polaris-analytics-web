import React from 'react';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {OrganizationDashboard} from "../organizationDashboard";
import {ProjectsTableWidget} from "./manage/projectsTable";

import Projects from "../../projects/context"
import { PlusOutlined } from '@ant-design/icons';
import Button from "../../../../components/uielements/button";

import AddProject from "./manage/addProject";

import {Contexts} from "../../../meta";
import {injectIntl} from "react-intl";
import {displayPlural} from "../../../i18n";

import OrganizationProjectsNetwork from "../../projects/labs/network/organizationProjectsNetwork";

const dashboard_id = 'dashboards.projects.organization.instance';




export default injectIntl(({intl}) => (
  <OrganizationDashboard
    pollInterval={60 * 1000}
    render={
      ({organization, context, lastRefresh}) => (
        organization.projectCount > 0 ?
          <Dashboard
            dashboard={`${dashboard_id}`}
          >
            <DashboardRow
              h='60%'
              title={displayPlural(intl, Contexts.projects)}
              controls={[
                () =>
                  <Button type="primary" onClick={() => context.go('.', 'new')}>
                    <PlusOutlined /> {`Connect Remote Projects`}
                  </Button>
              ]}
            >
              <DashboardWidget
                w={1}
                name={`network`}
                render={() => (
                <OrganizationProjectsNetwork
                  organizationKey={organization.key}
                  days={30}
                  measurementWindow={30}
                  samplingFrequency={30}
                  specsOnly={true}
                  includeSubTasks={false}
                />
              )}
                showDetail={true}
              />

            </DashboardRow>
            <DashboardRow h={"30%"}>
              <DashboardWidget
                w={1}
                name={`table`}
                render={() => (
                <ProjectsTableWidget
                  organizationKey={organization.key}
                  days={30}
                  measurementWindow={30}
                  samplingFrequency={30}
                  specsOnly={true}
                  includeSubTasks={false}
                />
              )}
                showDetail={true}
              />
            </DashboardRow>


          </Dashboard>
          :
          <AddProject context={context}/>
      )
    }/>
));



