import {Colors} from "../config";
import type {ActivityLevel, ActivitySummary} from "../views/activityProfile/model";
import {flatten} from "../../../helpers/collections";
import {daysSinceDate} from "../../../helpers/utility";

export const ACTIVITY_LEVELS: Array<ActivityLevel> = [
  {
    display_name: 'Inactive',
    activity_level_summary_property: 'inactiveCount',
    color: Colors.ActivityLevel.INACTIVE,
    isMember: activitySummary => activitySummary.days_since_latest_commit > 180,
    visible: false,
    index: 0
  },
  {
    display_name: 'Dormant',
    activity_level_summary_property: 'dormantCount',
    color: Colors.ActivityLevel.DORMANT,
    isMember: activitySummary => (90 < activitySummary.days_since_latest_commit) && (activitySummary.days_since_latest_commit <= 180),
    visible: false,
    index: 1
  },
  {
    display_name: 'Quiescent',
    activity_level_summary_property: 'quiescentCount',
    color: Colors.ActivityLevel.RECENT,
    isMember: activitySummary => (30 < activitySummary.days_since_latest_commit) && (activitySummary.days_since_latest_commit <= 90),
    visible: false,
    index: 2
  },
  {
    display_name: 'Active',
    activity_level_summary_property: 'activeCount',
    color: Colors.ActivityLevel.ACTIVE,
    isMember: activitySummary => (activitySummary.days_since_latest_commit <= 30),
    visible: true,
    index: 3
  }
];


export const ACTIVITY_LEVEL_UNKNOWN = {
  display_name: 'Unknown',
  color: Colors.ActivityLevel.UNKNOWN,
  isMember: () => false,
  visible: false
};

export const ACTIVITY_LEVEL_INITIAL = {
  display_name: 'Initial',
  color: Colors.ActivityLevel.INITIAL,
  isMember: () => false,
  visible: false
};

// map names to activity level
export const ACTIVITY_LEVEL = ACTIVITY_LEVELS.reduce((levelMap, level) => {
  levelMap[level.display_name] = level;
  return levelMap
}, {});


export const ACTIVITY_LEVELS_REVERSED = [...ACTIVITY_LEVELS].reverse();


export function getActivityLevel(activitySummary: ActivitySummary): ActivityLevel {
  const level = ACTIVITY_LEVELS.find(level => level.isMember(activitySummary));
  return level || ACTIVITY_LEVEL_INITIAL
}

export function getActivityLevelFromDate(latestCommit, latestWorkItemEvent) {
  if(!(latestCommit || latestWorkItemEvent)) return ACTIVITY_LEVEL_INITIAL

  const days_since_latest_commit = daysSinceDate(latestCommit) || daysSinceDate(latestWorkItemEvent);
  const level = ACTIVITY_LEVELS.find(level => level.isMember({
    days_since_latest_commit: days_since_latest_commit
  }));
  return level || ACTIVITY_LEVEL_INITIAL
}

export function withActivityLevel(activitySummary) {
  return {
    ...activitySummary,
    activity_level: getActivityLevel(activitySummary)
  }
}

export function partitionByActivityLevel(domain_data: Array<ActivitySummary>, showLevels=2) {
  let seriesByActivityLevel = [];
  let visible_levels=0;
  for (let i = 0; i < ACTIVITY_LEVELS_REVERSED.length; i++) {
    const level = ACTIVITY_LEVELS_REVERSED[i];
    let level_data = domain_data.filter(level.isMember);
    let level_visible = level_data.length > 0 && visible_levels < showLevels;
    seriesByActivityLevel[level.index] = {
      data: level_data,
      visible: level_visible
    };
    if (level_visible) { visible_levels = visible_levels + 1 }
  }
  return seriesByActivityLevel;
}

export function findVisibleLevels(domain_data: Array<ActivitySummary>, showLevels=2){
  if ((domain_data.length) >  0) {
    return flatten(partitionByActivityLevel(domain_data, showLevels).map(level => (level.visible? level.data : [])))
  } else {
    return [];
  }
}