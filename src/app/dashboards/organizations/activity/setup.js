import React from "react";
import {Col, Row, Progress} from "antd";
import {ImportProjectsCard} from "../../../components/cards/importProjectCard";
import {ImportRepositoriesCard} from "../../../components/cards/importRepositoriesCard";

export const ActivityDashboardSetup = ({organization, context}) => {
  const noProjects = organization.projectCount === 0;
  const noRepositories = organization.repositoryCount === 0;

  const projectsOffset = noRepositories ? 6 : 9;
  const repositoriesOffset = noProjects ? 0 : 9;


  return (
    <div>

      <div style={{padding: '30px'}}>
        <Row>
          <Col offset={6} span={12}>
            {
              noProjects && noRepositories ?
                <InitialSetupText organization={organization}/>
              : noProjects ?
                  <SetupProjectsText organization={organization} />
                : noRepositories ?
                  <SetupRepositoriesText organization={organization}/>
                  : null
            }
          </Col>
        </Row>
        <Row type={'flex'}>
          {
            noProjects &&
            <Col offset={projectsOffset} span={6}>
              <ImportProjectsCard title={"Connect Work Tracking System"} onClick={() => context.go('..', 'projects')}/>
            </Col>
          }
          {
            noRepositories &&
            <Col offset={repositoriesOffset} span={6}>
              <ImportRepositoriesCard title={"Connect Version Control System"} onClick={() => context.go('..', 'repositories')}/>
            </Col>
          }

        </Row>
      </div>

    </div>

  )
}

const InitialSetupText = ({organization}) => (
  <React.Fragment>
    <h1>Setup Organization {organization.name}</h1>
    <p>
      To view activity for this organization, you must import project data from a work tracking system
      that you use to manage your engineering projects, and commit data from from a Git based version control system.
      The process is simple and should take under 30 minutes in most cases. You may import project and commit data in
      any order.
    </p>
    <p>
      Once the initial data import is complete, Urjuna will
      keep your data updated automatically in real-time.
    </p>
  </React.Fragment>
);

const SetupProjectsText = ({organization}) => (
  <React.Fragment>
    <h1>Connect Work Tracking System for {organization.name}</h1>
    <p>
      Congratulations! You have completed the version control system setup for {organization.name}.
      Now let's finish by completing the work tracking system setup.
    </p>
  </React.Fragment>
);

const SetupRepositoriesText = ({organization}) => (
  <React.Fragment>
    <h1>Connect Version Control System for {organization.name}</h1>
    <p>
      Congratulations! You have completed the work tracking system setup for {organization.name}.
      Now let's finish by completing the version control system setup.
    </p>
  </React.Fragment>
)