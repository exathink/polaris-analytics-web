import {RowNoOverflow} from "../../../shared/containers/flex/rowNoOverflow";
import React from "react";

import {capitalizeFirstLetter, elide} from "../../../../helpers/utility";

function getRemoteBrowseUrl(workItem) {
  /* this is a hack. Need to replace with robust server side urls at some point */
  const url = new URL(workItem.url);
  switch (workItem.workTrackingIntegrationType) {
    case 'jira':
      return `${url.origin}/browse/${workItem.displayId}`;
    case 'pivotal_tracker':
      return workItem.url;
      break;
    case 'github':
      return workItem.url.replace('api.github.com/repos', 'github.com');
      break;
    default:
      return null;
  }
}

export const WorkItemRemoteLink = ({workItem}) => {
  const remoteBrowseUrl = getRemoteBrowseUrl(workItem);

  return (
    remoteBrowseUrl ?
      <a href={remoteBrowseUrl} target={"_blank"} title={`View work item on ${capitalizeFirstLetter(workItem.workTrackingIntegrationType)}`}>
        <RowNoOverflow align={'center'}>
          <h2 style={{color: "#7c7c7c", fontSize: '2.3vh'}}>
            {`${workItem.displayId}: ${elide(workItem.name, 250)}`}
          </h2>
          <i className={"ion ion-link"} style={{margin: '5px'}}/>
        </RowNoOverflow>
      </a>
      : <h2 style={{color: "#7c7c7c", fontSize: '2.3vh'}}>
        {`${workItem.displayId}: ${elide(workItem.name, 250)}`}
      </h2>
  );
};