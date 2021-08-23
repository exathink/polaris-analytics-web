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
           <ImportProjectsCard
            title={"Connect Projects"}
            onClick={() => context.go("..", "value-streams/new")}
            completed={noProjects === false}
          />
          <ImportRepositoriesCard
            title={"Connect Git Repositories"}
            onClick={() => context.go("..", "repositories/new")}
            completed={noRepositories === false}
          />

        </div>
      </div>
    </div>
  );
};

const InitialSetupText = ({organization}) => (
  <React.Fragment>
    <h1 className={fontStyles["text-2xl"]}>Let's connect Projects and Git Repositories for {organization.name}</h1>
    <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>It should take less than 15 minutes to get going. </p>
  </React.Fragment>
);

const SetupProjectsText = ({organization}) => (
  <React.Fragment>
    <h1 className={fontStyles["text-2xl"]}>Connect Work Tracking System for {organization.name}</h1>
    <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
      Congratulations! You have connected Git repositories for {organization.name}.
      Now let's finish by connecting projects.
    </p>
  </React.Fragment>
);

const SetupRepositoriesText = ({organization}) => (
  <React.Fragment>
    <h1 className={fontStyles["text-2xl"]}>Connect Version Control System for {organization.name}</h1>
    <p className={classNames(fontStyles["font-normal"], fontStyles["text-base"])}>
      Congratulations! You have connected projects for {organization.name}.
      Now let's finish by connecting your Git repositories.
    </p>
  </React.Fragment>
)