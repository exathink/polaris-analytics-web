// @flow

export type ActivityTotals = {
  commits: number,
  contributors: number,
  earliest_commit: Date,
  latest_commit: Date
}

export type Model = {
  data: ActivityTotals,
  displayProps: {
    bgColor: string,
    fontColor: string
  }

}