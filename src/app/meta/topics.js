import React from 'react';
import {FormattedMessage} from 'react-intl';

export const Topics = {
  flow: {
    name: 'flow',
    display: () => (<FormattedMessage id='topics.flow' defaultMessage="Flow"/>),
    icon: 'ion-ios-infinite-outline'
  },
  wip: {
    name: 'wip',
    display: () => (<FormattedMessage id='topics.wip' defaultMessage="Wip"/>),
    icon: 'ion-ios-pulse-strong'
  },
  activity: {
    name: 'activity',
    display: () => (<FormattedMessage id='topics.activity' defaultMessage="Activity"/>),
    icon: 'ion-ios-pulse-strong'
  },
  trends: {
    name: 'trends',
    display: () => (<FormattedMessage id='topics.trends' defaultMessage="Trends"/>),
    icon: 'ion-arrow-graph-up-right'
  },
  value: {
    name: 'value',
    display: () => (<FormattedMessage id='topics.value' defaultMessage="Value"/>),
    icon: 'ion-earth'
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
    icon: 'ion-fork-repo'
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
  work_item: {
    name: 'work_item',
    display: () => (<FormattedMessage id='topics.work_item' defaultMessage="Card"/>),
    icon: 'ion-checkmark'
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
  system: {
    name: 'system',
    display: () => (<FormattedMessage id='topics.system' defaultMessage="System"/>),
    icon: 'ion-ios-cog'
  },
  account: {
    name: 'account',
    display: () => (<FormattedMessage id='topics.account' defaultMessage="Account"/>),
    icon: 'ion-ios-home'
  },
  dashboard: {
    name: 'dashboard',
    display: () => (<FormattedMessage id='topics.dashboard' defaultMessage="Deshboards"/>),
    icon: 'ion-ios-pulse'
  },
  user: {
    name: 'user',
    display: () => (<FormattedMessage id='topics.user' defaultMessage="User"/>),
    icon: 'ion-person'
  },
  configure: {
    name: 'configure',
    display: () => (<FormattedMessage id='topics.configure' defaultMessage="Configure"/>),
    icon: 'ion-settings' //TODO: also this ion-ios-settings-strong
  }
};