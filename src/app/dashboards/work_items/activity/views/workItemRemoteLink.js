import {RowNoOverflow} from "../../../shared/containers/flex/rowNoOverflow";
import React from "react";

import {capitalizeFirstLetter, elide} from "../../../../helpers/utility";
import Button from "../../../../../components/uielements/button"
import {Link} from "react-router-dom";
import WorkItems from "../../../work_items/context";
import {url_for_instance} from "../../../../framework/navigation/context/helpers";

const workTrackingMap = {
  jira: "Jira",
  pivotal_tracker: "Pivotal Tracker",
  github: "Github",
  gitlab: "Gitlab",
};

function getRemoteBrowseUrl(workItem) {
  /* this is a hack. Need to replace with robust server side urls at some point */
  const url = new URL(workItem.url);
  switch (workItem.workTrackingIntegrationType) {
    case 'jira':
      return `${url.origin}/browse/${workItem.displayId}`;
    case 'pivotal_tracker':
      return workItem.url;
    case 'github':
      return workItem.url.replace('api.github.com/repos', 'github.com');
    case 'gitlab':
      return workItem.url;
    default:
      return null;
  }
}

export function WorkItemButtons({workItem, goToCardLink = true}) {
  const remoteBrowseUrl = getRemoteBrowseUrl(workItem);
  const getRemoteLinkButton = () => {
    if (remoteBrowseUrl) {
      return (
        <a
          href={remoteBrowseUrl}
          target={"_blank"}
          rel="noopener noreferrer"
          title={`View work item on ${capitalizeFirstLetter(workItem.workTrackingIntegrationType)}`}
        >
          <Button type="primary" size="medium" style={{marginLeft: "15px"}}>
            View in{" "}
            {workTrackingMap[workItem.workTrackingIntegrationType] ??
              capitalizeFirstLetter(workItem.workTrackingIntegrationType)}
          </Button>
        </a>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      {getRemoteLinkButton()}
      {goToCardLink && (
        <Link to={`${url_for_instance(WorkItems, workItem.displayId, workItem.key)}`}>
          <Button type="primary" size="medium" style={{marginLeft: "15px"}}>
            Go to Work Item
          </Button>
        </Link>
      )}
    </div>
  );
}

export const WorkItemRemoteLink = ({workItem, goToCardLink = true}) => {
  return (
    <RowNoOverflow>
      <div>
        <h2 style={{color: "#7c7c7c", fontSize: "2.3vh", marginBottom: 0}}>{`${workItem.displayId}: ${elide(
          workItem.name,
          250
        )}`}</h2>
      </div>
      <WorkItemButtons workItem={workItem} goToCardLink={goToCardLink}/>
    </RowNoOverflow>
  );
};