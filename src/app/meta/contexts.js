import React from 'react';
import {defineMessages, FormattedMessage} from 'react-intl';


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
  },
  contributors: {
    id: 'contexts.contributors.display',
    defaultMessage: "{quantity, plural, one {Contributor} other {Contributors}}"
  },
  commits: {
    id: 'contexts.commits.display',
    defaultMessage: "{quantity, plural, one {Commit} other {Commits}}"
  },
  oss: {
    id: 'contexts.oss',
    defaultMessage: "Open Source"
  },
  admin: {
    id: 'contexts.admin',
    defaultMessage: "Admin"
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
    color: '#356eb2',


  },
  organizations: {
    name: 'organizations',
    message: messages.organizations,
    display:
      (quantity = 0) => {
        return <FormattedMessage
          {...messages.organizations}
          values={{quantity: quantity}}
        />
      },
    icon: 'ion-ios-albums',
    color: '#356eb2'
  },
  projects: {
    name: 'projects',
    message: messages.projects,
    display:
        (quantity = 0) => {
          return <FormattedMessage
            {...messages.projects}
            values={{quantity: quantity}}
        />
        },
    icon: 'ion-folder',
    color: '#356eb2'
  },
  contributors: {
    name: 'contributors',
    message: messages.contributors,
    display:
        function (quantity = 0) {
          return <FormattedMessage
            {...messages.contributors}
            values={{quantity: quantity}}
          />
        },
    icon: 'ion-ios-people',
    color: '#356eb2',

  },
  repositories: {
    name: 'repositories',
    message: messages.repositories,
    display:
        function (quantity = 0) {
          return <FormattedMessage
            {...messages.repositories}
            values={{quantity: quantity}}
          />
        },
    icon: 'ion-soup-can',
    color: '#356eb2',

  },
  commits: {
    name: 'commits',
    message: messages.commits,
    display:
        function (quantity = 0) {
          return <FormattedMessage
            {...messages.commits}
            values={{quantity: quantity}}
          />
        },
    icon: 'ion-code',
    color: '#356eb2',

  },
  oss: {
    name: 'oss',
    message: messages.oss,
    display:
        function () {
          return <FormattedMessage
            {...messages.oss}
          />
        },
    icon: 'ion-ios-list',
    color: '#6b5fb2',
  },
  admin: {
    name: 'admin',
    message: messages.admin,
    display:
        function () {
          return <FormattedMessage
            {...messages.admin}
          />
        },
    icon: 'ion-ios-cog',
    color: '#6b5fb2',
  },
};