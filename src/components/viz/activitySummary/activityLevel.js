import {Colors} from "../config";
import type {ActivityLevel, ActivitySummary} from "./types";
import {flatten} from "../../../helpers/collections";

export const ACTIVITY_LEVELS: Array<ActivityLevel> = [
  {
    display_name: 'Older',
    color: Colors.ActivityBucket.INACTIVE,
    isMember: activitySummary => activitySummary.days_since_latest_commit > 180,
    visible: false,
    index: 0
  },
  {
    display_name: '6 Months',
    color: Colors.ActivityBucket.DORMANT,
    isMember: activitySummary => (90 < activitySummary.days_since_latest_commit) && (activitySummary.days_since_latest_commit <= 180),
    visible: false,
    index: 1
  },
  {
    display_name: '3 Months',
    color: Colors.ActivityBucket.RECENT,
    isMember: activitySummary => (30 < activitySummary.days_since_latest_commit) && (activitySummary.days_since_latest_commit <= 90),
    visible: false,
    index: 2
  },
  {
    display_name: '1 Month',
    color: Colors.ActivityBucket.ACTIVE,
    isMember: activitySummary => (activitySummary.days_since_latest_commit <= 30),
    visible: true,
    index: 3
  },
];
export const ACTIVITY_LEVEL_UNKNOWN = {
  display_name: 'Unknown',
  color: Colors.ActivityBucket.UNKNOWN,
  isMember: () => false,
  visible: false
};

export const ACTIVITY_LEVELS_REVERSED = [...ACTIVITY_LEVELS].reverse();


export function getActivityLevel(activitySummary: ActivitySummary): ActivityLevel {
  const level = ACTIVITY_LEVELS.find(level => level.isMember(activitySummary));
  return level || ACTIVITY_LEVEL_UNKNOWN
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