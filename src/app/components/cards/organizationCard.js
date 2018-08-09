import React from 'react';
import Organizations from "../../dashboards/organizations/context";
import {url_for_instance} from "../../framework/navigation/context/helpers";
import {Link} from 'react-router-dom';
import {Card, CardImage, CardContent} from "../cardGrid";

export const OrganizationCard = ({id, name, organizationKey, repositoryCount, projectCount}) => {
  return (
    <Card key={id}>
      <Link
        to={`${url_for_instance(Organizations, name, organizationKey)}`}
        title={'Show organization dashboard'}
      >
        <CardImage style={{height: "200px"}}>
          <i
            className={`ion ${Organizations.icon}`}
            style={{fontSize: "150px"}}
          />
        </CardImage>
      </Link>
      <CardContent style={{alignItems: 'flex-start'}}>
        <h3 className={"isoCardTitle"}>{name}</h3>
        {
          projectCount > 0 ?
            <Link to={`${url_for_instance(Organizations, name, organizationKey)}/activity/project-activity-levels`}>
              <span>Projects: {projectCount}</span>
            </Link> :
            <span>Projects: {projectCount}</span>
        }
        <Link to={`${url_for_instance(Organizations, name, organizationKey)}/activity/repository-activity-levels`}>
          <span>Repositories: {repositoryCount}</span>
        </Link>

      </CardContent>

    </Card>
  )
}

