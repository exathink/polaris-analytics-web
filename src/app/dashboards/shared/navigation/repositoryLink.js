import React from 'react';
import {Link} from 'react-router-dom';

import Repositories from '../../repositories/context';
import {encodeInstance} from "../../../framework/navigation/context/helpers";

export const RepositoryLink = ({repositoryName, repositoryKey, children}) => (
  <Link to={`${Repositories.url_for}/${encodeInstance(repositoryName, repositoryKey)}`}>
    {children}
  </Link>
)