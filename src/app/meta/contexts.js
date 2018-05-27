import React from 'react';
import {FormattedPlural, FormattedMessage} from 'react-intl';

export const Contexts = {
  organization: {
    name: 'organization',
    display: function () {return this.displays.default()},
    displays: {
      default:
        (quantity = 1) => (
          <FormattedPlural
            id='contexts.organization'
            one="Organization"
            other="Organizations"
            value={quantity}
          />
        ),
      instance:
        instanceName => (
          <FormattedMessage
            id="contexts.organizations.instance"
            defaultMessage="Organization: {instance}"
            values={{instance: instanceName}}
          />
        )
    }
  },
  project: {
    name: 'project',
    display: function () {return this.displays.default()},
    displays: {
      default:
        (quantity = 1) => (
          <FormattedPlural
            id='contexts.project'
            one="Project"
            other="Projects"
            value={quantity}
          />
        ),
      instance:
        instanceName => (
          <FormattedMessage
            id="contexts.projects.instance"
            defaultMessage="Project: {instance}"
            values={{instance: instanceName}}
          />
        )
    }
  },
  repository: {
    name: 'repository',
    display: function () {return this.displays.default()},
    displays: {
      default:
        (quantity = 1) => (
          <FormattedPlural
            id='contexts.repository'
            one="Repository"
            other="Repositories"
            value={quantity}
          />
        ),
      instance:
        instanceName => (
          <FormattedMessage
            id="contexts.repositories.instance"
            defaultMessage="Repository: {instance}"
            values={{instance: instanceName}}
          />
        )
    }
  }
};