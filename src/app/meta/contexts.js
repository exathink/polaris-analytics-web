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
        )
    }
  }
};