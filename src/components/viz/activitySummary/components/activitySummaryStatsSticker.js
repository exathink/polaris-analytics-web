import React from 'react';
import type {Props} from '../types';
import IsoWidgetsWrapper from '../../../../containers/Widgets/widgets-wrapper';
import StickerWidget from '../../../../containers/Widgets/sticker/sticker-widget';
import {VizRow, VizItem} from "../../containers/layout";
import moment from 'moment';

const human_span = (moment_a, moment_b) => {
  const span = moment.duration(moment_a.diff(moment_b));
  const years = span.years();
  const d_years = `${years > 0 ? years + (years > 1 ? ' Years' : ' Year'): ''}`;

  const months = span.months();
  const d_months = `${months > 0 ? months + (months > 1 ? ' Months': ' Month'): ''}`;
  return years+months > 0 ? `${d_years}${(years > 0 ? ', ' : '')}${d_months}` : '0 Years';
};

export const ActivitySummaryStatsStickers = (props: Props) => {
  const domain_data = props.viz_domain.data;

  const data = domain_data.reduce((totals, activitySummary) => {
   totals.commits = totals.commits + activitySummary.commit_count;
   totals.contributors = totals.contributors + activitySummary.contributor_count;
   if (activitySummary.earliest_commit.isBefore(totals.earliest_commit)) {
     totals.earliest_commit = activitySummary.earliest_commit;
   }
   if (activitySummary.latest_commit.isAfter(totals.latest_commit)) {
     totals.latest_commit = activitySummary.latest_commit
   }
   return totals;
  }, {
    commits: 0,
    contributors: 0,
    earliest_commit: domain_data.length > 0 ? domain_data[0].earliest_commit : moment(),
    latest_commit: domain_data.length > 0 ? domain_data[0].latest_commit : moment()
  });

  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={0.25}>
          <IsoWidgetsWrapper>
            {/* Sticker Widget */}
            <StickerWidget
              number={props.viz_domain.data.length}
              text={`${props.viz_domain.subject_label_long}s`}
              icon={props.viz_domain.subject_icon}
              fontColor="#ffffff"
              bgColor={props.viz_domain.subject_color}
            />
          </IsoWidgetsWrapper>
        </VizItem>
        <VizItem w={0.25}>
          <IsoWidgetsWrapper>
            {/* Sticker Widget */}
            <StickerWidget
              number={data.contributors.toLocaleString()}
              text={"Contributors"}
              icon="ion-ios-people"
              fontColor="#ffffff"
              bgColor={props.viz_domain.subject_color}
            />
          </IsoWidgetsWrapper>
        </VizItem>
        <VizItem w={0.25}>
          <IsoWidgetsWrapper>
            {/* Sticker Widget */}
            <StickerWidget
              number={data.commits.toLocaleString()}
              text={"Commits"}
              icon="ion-code"
              fontColor="#ffffff"
              bgColor={props.viz_domain.subject_color}
            />
          </IsoWidgetsWrapper>
        </VizItem>
        <VizItem w={0.25}>
          <IsoWidgetsWrapper>
            {/* Sticker Widget */}
            <StickerWidget
              number={human_span(data.latest_commit, data.earliest_commit)}
              text={'Timespan'}
              icon="ion-clock"
              fontColor="#ffffff"
              bgColor={props.viz_domain.subject_color}
            />
          </IsoWidgetsWrapper>
        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};
