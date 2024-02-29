import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

import {
  FieldTimeOutlined,
  ProjectOutlined,
  FunnelPlotOutlined,
  SettingOutlined,
  AimOutlined, ArrowRightOutlined, DashboardOutlined, HourglassOutlined, BuildOutlined,
  PartitionOutlined
} from "@ant-design/icons";

export const Topics = {
  flow: {
    name: 'flow',
    display: () => (<FormattedMessage id='topics.flow' defaultMessage="Flow"/>),
    icon: 'ion-ios-infinite-outline'
  },
  stability: {
    name: 'stability',
    display: () => (<FormattedMessage id='topics.stability' defaultMessage="Stability"/>),
    Icon: AimOutlined
  },
  flowTrends: {
    name: 'flowTrends',
    display: () => (<FormattedMessage id='topics.flowTrends' defaultMessage="Flow Trends"/>),
    icon: 'ion-arrow-graph-up-right'
  },
  newflow: {
    name: 'newflow',
    display: () => (<FormattedMessage id='topics.newflow' defaultMessage="New Flow"/>),
    icon: 'ion-magnet'
  },
  wip: {
    name: 'wip',
    display: () => (<FormattedMessage id='topics.wip' defaultMessage="Wip"/>),
    Icon: BuildOutlined
  },
  queues: {
    name: 'wip',
    display: () => (<FormattedMessage id='topics.queues' defaultMessage="Queues"/>),
    icon: 'ion-ios-pulse-strong'
  },
  motion: {
    name: 'motion',
    display: () => (<FormattedMessage id='topics.motion' defaultMessage="Motion"/>),
    Icon: ArrowRightOutlined
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
  traceability: {
    name: 'traceability',
    display: () => (<FormattedMessage id='topics.traceability' defaultMessage="Shadow Work"/>),
    icon: 'ion-contrast'
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
    display: () => (<FormattedMessage id='topics.responseTime' defaultMessage="Response Time Analysis"/>),
    Icon: HourglassOutlined
  },
  throughput: {
    name: 'throughput',
    display: () => (<FormattedMessage id='topics.throughput' defaultMessage="Throughput Analysis"/>),
    Icon: DashboardOutlined
  },
  value: {
    name: 'value',
    display: () => (<FormattedMessage id='topics.value' defaultMessage="Value"/>),
    icon: 'ion-social-usd'
  },
  valueMix: {
    name: 'valueMix',
    display: () => (<FormattedMessage id='topics.valueMix' defaultMessage="Allocations"/>),
    icon: 'ion-android-options'
  },
  alignment: {
    name: 'alignment',
    display: () => (<FormattedMessage id='topics.alignment' defaultMessage="Alignment"/>),
    icon: 'ion-compass'
  },
  valueBook: {
    name: 'valueBook',
    display: () => (<FormattedMessage id='topics.valueBook' defaultMessage="Alignment"/>),
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
    Icon: ProjectOutlined
  },
  stabilitySettings: {
    name: 'stability',
    display: () => (<FormattedMessage id='topics.stabilitySettings' defaultMessage="Stability Goals"/>),
    Icon: FieldTimeOutlined
  },
  flow_mapping: {
    name: 'value_stream_map',
    display: () => (<FormattedMessage id='topics.flow_mapping' defaultMessage="Flow Map"/>),
    Icon: FunnelPlotOutlined
  },
  settings: {
    name: 'settings',
    display: () => (<FormattedMessage id='topics.settings' defaultMessage="Settings"/>),
    Icon: SettingOutlined
  },
  pull_requests: {
    name: 'pull_requests',
    display: () => (<FormattedMessage id='topics.pull_requests' defaultMessage="Pull Requests"/>),
    icon: 'ion-pull-request'
  },
  first: {
    name: 'first',
    display: () => (<FormattedMessage id='topics.first' defaultMessage="First"/>),
    icon: 'ion-magnet'
  },
  second: {
    name: 'second',
    display: () => (<FormattedMessage id='topics.second' defaultMessage="Second"/>),
    icon: 'ion-ios-gear'
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
  network: {
    name: 'network',
    display: () => (<FormattedMessage id='topics.network' defaultMessage="Network"/>),
    Icon: PartitionOutlined
  },
};