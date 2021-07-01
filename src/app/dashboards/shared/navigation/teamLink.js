import React from 'react';
import {Link} from 'react-router-dom';

import Teams from '../../teams/context';
import {encodeInstance} from "../../../framework/navigation/context/helpers";

export const TeamLink = ({teamName, teamKey, children}) => (
  <Link to={`${Teams.url_for}/${encodeInstance(teamName, teamKey)}`}>
    {children}
  </Link>
)