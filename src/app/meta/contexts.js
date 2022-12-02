import React from 'react';
import {defineMessages, FormattedMessage} from 'react-intl.macro';


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
    defaultMessage: "{quantity, plural, one {Value Stream} other {Value Streams}}"
  },
  teams: {
    id: 'contexts.teams.display',
    defaultMessage: "{quantity, plural, one {Team} other {Teams}}"
  },
  library: {
    id: 'contexts.library.display',
    defaultMessage: "{quantity, plural, one {Library} other {Libraries}}"
  },
  work_items: {
    id: 'contexts.work_items.display',
    defaultMessage: "{quantity, plural, one {Work Item} other {Work Items}}"
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
  settings: {
    id: 'contexts.settings',
    defaultMessage: "Settings"
  }

});






export const Contexts = {
  accounts: {
    name: 'account',
    message: messages.accounts,
    display:
      (quantity = 0) => {
        return <FormattedMessage
          id="contexts.accounts.display"
          defaultMessage="{quantity, plural, one {Account} other {Accounts}}"
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
          id="contexts.organizations.display"
          defaultMessage="{quantity, plural, one {Organization} other {Organizations}}"
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
            id="contexts.projects.display"
            defaultMessage="{quantity, plural, one {Value Stream} other {Value Streams}}"
            values={{quantity: quantity}}
        />
        },
    icon: 'ion-folder',
    color: '#356eb2'
  },
  teams: {
    name: 'teams',
    message: messages.teams,
    display:
        (quantity = 0) => {
          return <FormattedMessage
            id="contexts.teams.display"
            defaultMessage="{quantity, plural, one {Team} other {Teams}}"
            values={{quantity: quantity}}
        />
        },
    icon: 'ion-ios-people',
    color: '#356eb2'
  },
  library: {
    name: 'library',
    message: messages.library,
    display:
        (quantity = 0) => {
          return <FormattedMessage
            id="contexts.library.display"
            defaultMessage="{quantity, plural, one {Content Library} other {Content Library}}"
            values={{quantity: quantity}}
        />
        },
    icon: 'ion-ios-copy-outline',
    color: '#356eb2'
  },
  work_items: {
    name: 'work_items',
    message: messages.work_items,
    display:
        (quantity = 0) => {
          return <FormattedMessage
            id="contexts.work_items.display"
            defaultMessage="{quantity, plural, one {Card} other {Cards}}"
            values={{quantity: quantity}}
        />
        },
    icon: 'ion-checkmark',
    color: '#356eb2'
  },
  contributors: {
    name: 'contributors',
    message: messages.contributors,
    display:
        function (quantity = 0) {
          return <FormattedMessage
            id="contexts.contributors.display"
            defaultMessage="{quantity, plural, one {Contributor} other {Contributors}}"
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
            id="contexts.repositories.display"
            defaultMessage="{quantity, plural, one {Repository} other {Repositories}}"
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
            id="contexts.commits.display"
            defaultMessage="{quantity, plural, one {Commit} other {Commits}}"
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
            id="contexts.oss"
            defaultMessage="Open Source"
          />
        },
    icon: 'ion-ios-list',
    color: '#6b5fb2',
  },
  settings: {
    name: 'settings',
    message: messages.settings,
    display:
        function () {
          return <FormattedMessage
            id="contexts.settings"
            defaultMessage="Settings"
          />
        },
    icon: 'ion-ios-cog',
    color: '#6b5fb2',
  },
};