import React from 'react';
import Organizations from "../../dashboards/organizations/context";
import {url_for_instance} from "../../framework/navigation/context/helpers";
import {Link} from 'react-router-dom';
import {Card, CardImage, CardContent} from "../cardGrid";

export const OrganizationCard = ({id, name, organizationKey, repoCount}) => {
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
        <Link to={`${url_for_instance(Organizations, name, organizationKey)}/activity/repository-activity-levels`}>
          <span>Repositories: {repoCount}</span>
        </Link>
      </CardContent>

    </Card>
  )
}

