import React from 'react';
import Organizations from "../../dashboards/organizations/context";
import Projects from "../../dashboards/projects/context";
import {url_for_instance} from "../../framework/navigation/context/helpers";
import {Link} from 'react-router-dom';
import {Card, CardImage, CardContent} from "../cardGrid";

export const ProjectCard = ({id, name, projectKey, repoCount, organizationName, organizationKey}) => {
  return (
    <Card key={id}>
      <Link
        to={`${url_for_instance(Projects, name, projectKey)}`}
        title={'Show project dashboard'}
      >
        <CardImage style={{height: "200px"}}>
          <i
            className={`ion ${Projects.icon}`}
            style={{fontSize: "150px"}}
          />
        </CardImage>
      </Link>
      <CardContent style={{alignItems: 'flex-start'}}>
        <h3 className={"isoCardTitle"}>{name}</h3>
        <Link to={`${url_for_instance(Projects, name, projectKey)}/activity/repository-activity-levels`}>
          <span>Repositories: {repoCount}</span>
        </Link>
        <Link
          to={`${url_for_instance(Organizations, organizationName, organizationKey)}`}
          title={'Show organization dashboard'}
        >
          {<span>Organization: {organizationName}</span>}
        </Link>
      </CardContent>

    </Card>
  )
}

