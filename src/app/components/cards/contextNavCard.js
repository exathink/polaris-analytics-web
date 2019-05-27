import React from 'react';
import {NavCard} from "./navCard";
import {withViewerContext, verifySystemRoles} from "../../framework/viewer/viewerContext";

export const ContextNavCard = withViewerContext(
  ({context, title, viewerContext, allowedRoles}) => (
    viewerContext.hasSystemRoles(allowedRoles) ?
      <NavCard
        link={context.url_for}
        icon={context.icon}
        title={title || context.display()}
      />
      :
      null
  ))