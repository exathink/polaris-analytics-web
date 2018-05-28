import React from 'react';
import {FormattedMessage} from 'react-intl';

export const Contexts = {
  accounts: {
    name: 'account',
    display: function () {return this.displays.default()},
    displays: {
      default:
        (quantity = 0) => (
          <FormattedMessage
            id='contexts.account'
            defaultMessage="
            {
              quantity, plural,
              one {Account}
              other {Accounts}
            }"
            values={{quantity: quantity}}
          />
        ),
      instance:
        instanceName => (
          <FormattedMessage
            id="contexts.accounts.instance"
            defaultMessage="Account: {instance}"
            values={{instance: instanceName}}
          />
        ),
      overview: () => (
        <FormattedMessage
          id="contexts.accounts.overview"
          defaultMessage="Account Overview"
        />
      )
    }
  },
  organizations: {
    name: 'organization',
    display: function () {return this.displays.default()},
    displays: {
      default:
        (quantity = 0) => (
          <FormattedMessage
            id='contexts.organization'
            defaultMessage="
            {
              quantity, plural,
              one {Organization}
              other {Organizations}
            }"
            values={{quantity: quantity}}
          />
        ),
      instance:
        instanceName => (
          <FormattedMessage
            id="contexts.organizations.instance"
            defaultMessage="Organization: {instance}"
            values={{instance: instanceName}}
          />
        ),
      overview: () => (
        <FormattedMessage
          id="contexts.organizations.overview"
          defaultMessage="Organization Overview"
        />
      )
    }
  },
  projects: {
    name: 'project',
    display: function () {return this.displays.default()},
    displays: {
      default:
        (quantity = 0) => (
          <FormattedMessage
            id='contexts.project'
            defaultMessage="
            {
              quantity, plural,
              one {Project}
              other {Projects}
            }"
            values={{quantity: quantity}}
          />
        ),
      instance:
        instanceName => (
          <FormattedMessage
            id="contexts.projects.instance"
            defaultMessage="Project: {instance}"
            values={{instance: instanceName}}
          />
        ),
      overview: () => (
        <FormattedMessage
          id="contexts.projects.overview"
          defaultMessage="Project Overview"
        />
      )
    }
  },
  repositories: {
    name: 'repository',
    display: function () {return this.displays.default()},
    displays: {
      default:
        (quantity = 0) => (
          <FormattedMessage
            id='contexts.repository'
            defaultMessage="
            {
              quantity, plural,
              one {Repository}
              other {Repositories}
            }"
            values={{quantity: quantity}}
          />
        ),
      instance:
        instanceName => (
          <FormattedMessage
            id="contexts.repositories.instance"
            defaultMessage="Repository: {instance}"
            values={{instance: instanceName}}
          />
        ),
      overview: () => (
        <FormattedMessage
          id="contexts.repositories.overview"
          defaultMessage="Repository Overview"
        />
      )
    }
  }
};