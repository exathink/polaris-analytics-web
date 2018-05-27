import React from 'react';
import {FormattedMessage} from 'react-intl';

export const Contexts = {
  organization: {
    name: 'organization',
    display: () => (<FormattedMessage id='contexts.organization' defaultMessage="Organization"/>)
  },
  project: {
    name: 'project',
    display: () => (<FormattedMessage id='contexts.project' defaultMessage="Project"/>)
  },
  repository: {
    name: 'repository',
    display: () => (<FormattedMessage id='contexts.repository' defaultMessage="Repository"/>)
  }
};