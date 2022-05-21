import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

export const Topics = {
  flow: {
    name: 'flow',
    display: () => (<FormattedMessage id='topics.flow' defaultMessage="Flow Analysis"/>),
    icon: 'ion-ios-infinite-outline'
  },
  wip: {
    name: 'wip',
    display: () => (<FormattedMessage id='topics.wip' defaultMessage="Wip Analysis"/>),
    icon: 'ion-ios-pulse-strong'
  },
  productVideos: {
    name: 'productVideos',
    display: () => (<FormattedMessage id='topics.productVideos' defaultMessage="Product Videos"/>),
    icon: 'ion-ios-videocam-outline'
  },
  activity: {
    name: 'activity',
    display: () => (<FormattedMessage id='topics.activity' defaultMessage="Activity"/>),
    icon: 'ion-ios-pulse-strong'
  },
  trends: {
    name: 'trends',
    display: () => (<FormattedMessage id='topics.trends' defaultMessage="360° Trends"/>),
    icon: 'ion-eye'
  },
  quality: {
    name: 'quality',
    display: () => (<FormattedMessage id='topics.quality' defaultMessage="Quality"/>),
    icon: 'ion-ios-checkmark-outline'
  },
  balance: {
    name: 'balance',
    display: () => (<FormattedMessage id='topics.capacity' defaultMessage="Work Balance"/>),
    icon: 'ion-ios-analytics-outline'
  },
  responseTime: {
    name: 'responseTime',
    display: () => (<FormattedMessage id='topics.responseTime' defaultMessage="Response Time"/>),
    icon: 'ion-arrow-return-left'
  },
  throughput: {
    name: 'throughput',
    display: () => (<FormattedMessage id='topics.throughput' defaultMessage="Throughput"/>),
    icon: 'ion-arrow-right-a'
  },
  value: {
    name: 'value',
    display: () => (<FormattedMessage id='topics.value' defaultMessage="Value"/>),
    icon: 'ion-social-usd'
  },
  alignment: {
    name: 'alignment',
    display: () => (<FormattedMessage id='topics.alignment' defaultMessage="Alignment"/>),
    icon: 'ion-compass'
  },
  valueBook: {
    name: 'valueBook',
    display: () => (<FormattedMessage id='topics.valueBook' defaultMessage="Value Book"/>),
    icon: 'ion-social-usd'
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
  },
  home: {
    name: 'home',
    display: () => (<FormattedMessage id='topics.home' defaultMessage="Home"/>),
    icon: 'ion-ios-home'
  },
};