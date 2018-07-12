import React from 'react';
import Organizations from "../../dashboards/organizations/context";
import Projects from "../../dashboards/projects/context";
import {url_for_instance} from "../../framework/navigation/context/helpers";
import {Link} from 'react-router-dom';
import {Card, CardImage, CardContent} from "../cardGrid";

export const ProjectCard = ({id, name, projectKey, repoCount, organization}) => {
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
        <span>Repositories: {repoCount}</span>
        <Link
          to={`${url_for_instance(Organizations, organization.name, organization.organizationKey)}`}
          title={'Show organization dashboard'}
        >
          {<span>Organization: {organization.name}</span>}
        </Link>
      </CardContent>
    </Card>
  )
}

