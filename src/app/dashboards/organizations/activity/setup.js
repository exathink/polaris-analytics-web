import React from "react";
import {ImportProjectsCard} from "../../../components/cards/importProjectCard";
import {ImportRepositoriesCard} from "../../../components/cards/importRepositoriesCard";
import fontStyles from "../../../framework/styles/fonts.module.css"
import styles from "./activity.module.css";
import classNames from "classnames";

export const ActivityDashboardSetup = ({organization, context}) => {
  const noProjects = organization.projectCount === 0;
  const noRepositories = organization.repositoryCount === 0;

  return (
    <div className={styles.activityWrapper}>
      <div className={styles.activityDashboard}>
        <div className={styles.textCenter}>
          {noProjects && noRepositories ? (
            <InitialSetupText organization={organization} />
          ) : noRepositories ? (
            <SetupRepositoriesText organization={organization} />
          ) : noProjects ? (
            <SetupProjectsText organization={organization} />
          ) : null}
        </div>
        <div>
          <ImportRepositoriesCard
            title={"Connect Version Control System"}
            onClick={() => context.go("..", "repositories")}
            completed={noRepositories === false}
          />

          <ImportProjectsCard
            title={"Connect Work Tracking System"}
            onClick={() => context.go("..", "value-streams")}
            completed={noProjects === false}
          />
        </div>
      </div>
    </div>
  );
};

const InitialSetupText = ({organization}) => (
  <React.Fragment>
    <h1 className={fontStyles["text-2xl"]}>Setup Organization {organization.name}</h1>
    <p className={fontStyles["font-normal"]}>
      To view activity for this organization, you must import project data from a work tracking system
      that you use to manage your engineering projects, and commit data from from a Git based version control system.
      The process is simple and should take under 30 minutes in most cases. You may import project and commit data in
      any order.
    </p>
    <p>
      Once the initial data import is complete, Polaris Flow will
      keep your data updated automatically in real-time.
    </p>
  </React.Fragment>
);

const SetupProjectsText = ({organization}) => (
  <React.Fragment>
    <h1 className={fontStyles["text-2xl"]}>Connect Work Tracking System for {organization.name}</h1>
    <p className={classNames(fontStyles["font-normal"], fontStyles(["text-base"]))}>
      Congratulations! You have completed the version control system setup for {organization.name}.
      Now let's finish by completing the work tracking system setup.
    </p>
  </React.Fragment>
);

const SetupRepositoriesText = ({organization}) => (
  <React.Fragment>
    <h1 className={fontStyles["text-2xl"]}>Connect Version Control System for {organization.name}</h1>
    <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
      Congratulations! You have completed the work tracking system setup for {organization.name}.
      Now let's finish by completing the version control system setup.
    </p>
  </React.Fragment>
)