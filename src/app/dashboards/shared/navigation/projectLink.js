import React from 'react';
import {Link} from 'react-router-dom';

import Projects from '../../projects/context';
import {encodeInstance} from "../../../framework/navigation/context/helpers";

export const ProjectLink = ({projectName, projectKey, children}) => (
  <Link to={`${Projects.url_for}/${encodeInstance(projectName, projectKey)}`}>
    {children}
  </Link>
)