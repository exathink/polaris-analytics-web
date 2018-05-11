// @flow

export type ActivityTotals = {
  commits: number,
  contributors: number,
  earliest_commit: Date,
  latest_commit: Date
}

export type Model = {
  data: ActivityTotals,
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