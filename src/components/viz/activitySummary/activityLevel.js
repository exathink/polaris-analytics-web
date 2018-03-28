import {Colors} from "../config";
import type {ActivityLevel, ActivitySummary} from "./types";

export const activity_levels: Array<ActivityLevel> = [
  {
    display_name: 'Inactive',
    color: Colors.ActivityBucket.INACTIVE,
    isMember: activitySummary => activitySummary.days_since_latest_commit > 180,
    visible: false,
    priority: 0
  },
  {
    display_name: '6 Months',
    color: Colors.ActivityBucket.DORMANT,
    isMember: activitySummary => (90 < activitySummary.days_since_latest_commit) && (activitySummary.days_since_latest_commit <= 180),
    visible: false,
    priority: 1
  },
  {
    display_name: '3 Months',
    color: Colors.ActivityBucket.RECENT,
    isMember: activitySummary => (30 < activitySummary.days_since_latest_commit) && (activitySummary.days_since_latest_commit <= 90),
    visible: false,
    priority: 2
  },
  {
    display_name: '1 Month',
    color: Colors.ActivityBucket.ACTIVE,
    isMember: activitySummary => (activitySummary.days_since_latest_commit <= 30),
    visible: true,
    priority: 3
  },
];
export const ACTIVITY_LEVEL_UNKNOWN = {
  display_name: 'Unknown',
  color: Colors.ActivityBucket.UNKNOWN,
  isMember: () => false,
  visible: false
};

export function getActivityLevel(activitySummary: ActivitySummary): ActivityLevel {
  const level = activity_levels.find(level => level.isMember(activitySummary));
  return level || ACTIVITY_LEVEL_UNKNOWN
}

export function withActivityLevel(activitySummary) {
  return {
    ...activitySummary,
    activity_level: getActivityLevel(activitySummary)
  }
}