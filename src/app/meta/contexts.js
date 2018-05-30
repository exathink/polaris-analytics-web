import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';

const messages = defineMessages({
  accounts: {
    id: 'contexts.accounts.display',
    defaultMessage: "{quantity, plural, one {Account} other {Accounts}}"
  },
  organizations: {
    id: 'contexts.organizations.display',
    defaultMessage: "{quantity, plural, one {Organization} other {Organizations}}"
  },
  projects: {
    id: 'contexts.projects.display',
    defaultMessage: "{quantity, plural, one {Project} other {Projects}}"
  },
  repositories: {
    id: 'contexts.repositories.display',
    defaultMessage: "{quantity, plural, one {Repository} other {Repositories}}"
  }

});






export const Contexts = {
  accounts: {
    name: 'account',
    message: messages.accounts,
    display:
      (quantity = 0) => {
        return <FormattedMessage
          {...messages.accounts}
          values={{quantity: quantity}}
        />
      },
    icon: 'ion-ios-home',
    color: '#6b5fb2',


  },
  organizations: {
    name: 'organization',
    message: messages.organizations,
    display:
        (quantity = 0) => {
          return <FormattedMessage
            {...messages.organizations}
            values={{quantity: quantity}}
          />
        },
    icon: 'ion-ios-albums',
    color: '#356eb2',

  },
  projects: {
    name: 'project',
    message: messages.projects,
    display:
        (quantity = 0) => {
          return <FormattedMessage
            {...messages.projects}
            values={{quantity: quantity}}
        />
        },
    icon: 'ion-folder',
    color: '#8188b2'


  },
  repositories: {
    name: 'repository',
    message: messages.repositories,
    display:
        function (quantity = 0) {
          return <FormattedMessage
            {...messages.repositories}
            values={{quantity: quantity}}
          />
        },
    icon: 'ion-soup-can',

  }
};