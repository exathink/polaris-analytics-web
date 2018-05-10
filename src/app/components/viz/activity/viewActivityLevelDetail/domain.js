export type ActivitySummary = {
  id: string;
  entity_name: string,
  commit_count: number,
  contributor_count: number,
  earliest_commit: Date,
  latest_commit: Date,
  span: number,
  days_since_latest_commit: number,
  activity_level: ActivityLevel
}

export type VizDomain = {
  data: Array<ActivitySummary>,
  level_label: string,
  level: string,
  subject_label_long: string,
  subject_label: string,
  subject_label_plural: string,
  subject_icon: string,
  subject_color: string,
  span_uom: string,
  onDrillDown?: () => void

}
export type Props = {
  viz_domain: VizDomain,
  onActivitiesSelected: (any) => void,
  selectedActivities: Array<ActivitySummary> | null
}


export type ActivityLevel = {
  display_name: string,
  color: string,
  isMember: (activitySummary: ActivitySummary) => boolean,
  visible: boolean,
  index: number
}