import React from 'react';
import {FormattedMessage} from 'react-intl';

export const Topics = {
  activity: {
    name: 'activity',
    display: () => (<FormattedMessage id='topics.activity' defaultMessage="Activity"/>),
    icon: 'ion-ios-pulse-strong'
  },
  contributors: {
    name: 'contributors',
    display: () => (<FormattedMessage id='topics.contributors' defaultMessage="Contributors"/>),
    icon: 'ion-ios-people'
  },
  projects: {
    name: 'projects',
    display: () => (<FormattedMessage id='topics.projects' defaultMessage="Projects"/>),
    icon: 'ion-folder'
  },
  repositories: {
    name: 'repositories',
    display: () => (<FormattedMessage id='topics.repositories' defaultMessage="Repositories"/>),
    icon: 'ion-soup-can'
  },
  organizations: {
    name: 'organizations',
    display: () => (<FormattedMessage id='topics.organizations' defaultMessage="Organizations"/>),
    icon: 'ion-folder'
  },
  commit: {
    name: 'commit',
    display: () => (<FormattedMessage id='topics.commit' defaultMessage="Commit"/>),
    icon: 'ion-code'
  },
  history: {
    name: 'history',
    display: () => (<FormattedMessage id='topics.history' defaultMessage="History"/>),
    icon: 'ion-clock'
  },
  work: {
    name: 'work',
    display: () => (<FormattedMessage id='topics.work' defaultMessage="Work"/>),
    icon: 'ion-clipboard'
  },
  settings: {
    name: 'settings',
    display: () => (<FormattedMessage id='topics.settings' defaultMessage="Settings"/>),
    icon: 'ion-ios-cog'
  },
  admin: {
    name: 'admin',
    display: () => (<FormattedMessage id='topics.admin' defaultMessage="Admin"/>),
    icon: 'ion-ios-cog'
  },
  manage: {
    name: 'manage',
    display: () => (<FormattedMessage id='topics.manage' defaultMessage="Manage"/>),
    icon: 'ion-ios-cog'
  },
  accounts: {
    name: 'accounts',
    display: () => (<FormattedMessage id='topics.accounts' defaultMessage="Accounts"/>),
    icon: 'ion-ios-home'
  },
  dashboard: {
    name: 'dashboard',
    display: () => (<FormattedMessage id='topics.dashboard' defaultMessage="Deshboards"/>),
    icon: 'ion-ios-pulse'
  },
};