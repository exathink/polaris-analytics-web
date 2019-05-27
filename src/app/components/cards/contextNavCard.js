import React from 'react';
import {NavCard} from "./navCard";
import {withViewerContext, verifyRoles} from "../../framework/viewer/viewerContext";

export const ContextNavCard = withViewerContext(
  ({context, title, viewerContext: {viewer}, allowedRoles}) => (
    verifyRoles(viewer, allowedRoles) ?
      <NavCard
        link={context.url_for}
        icon={context.icon}
        title={title || context.display()}
      />
      :
      null
  ))