


import React from 'react';
import {Link} from 'react-router-dom';

import WorkItems from '../../work_items/context';
import {encodeInstance} from "../../../framework/navigation/context/helpers";

export const WorkItemLink = ({displayId, workItemKey, children}) => (
  <Link to={`${WorkItems.url_for}/${encodeInstance(displayId, workItemKey)}`}>
    {children}
  </Link>
)