import React from 'react';
import StickerWidget from '../../containers/widgets/simpleSticker/sticker-widget';
import {VizItem, VizRow} from "../../containers/layout/index";
import moment from 'moment';


const human_span = (date_a, date_b) => {
  const moment_a = moment(date_a);
  const moment_b = moment(date_b);
  const span = moment.duration(moment_a.diff(moment_b));
  const years = span.years();
  const d_years = `${years > 0 ? years + (years > 1 ? ' Years' : ' Year'): ''}`;

  const months = span.months();
  const d_months = `${months > 0 ? months + (months > 1 ? ' Months': ' Month'): ''}`;
  return years+months > 0 ? `${d_years}${(years > 0 ? ', ' : '')}${d_months}` : '0 Years';
};

export const ActivitySummary = ({data, context}) => {
  const commitCount = data.commitCount? data.commitCount.toLocaleString() : '0';
  const contributorCount = data.contributorCount? data.contributorCount.toLocaleString() : '0';
  const span = data.latestCommit && data.earliestCommit ? human_span(data.latestCommit, data.earliestCommit) : 'N/A';
  const bgColor = context.color();
  const fontColor = "#ffffff";

  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 3}>

          {/* Sticker Widget */}
          <StickerWidget
            number={commitCount}
            text={"Commits"}
            icon="ion-code"
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>
        <VizItem w={1 / 3}>

          {/* Sticker Widget */}
          <StickerWidget
            number={span}
            text={'History'}
            icon="ion-clock"
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>
        <VizItem w={1 / 3}>

          {/* Sticker Widget */}
          <StickerWidget
            number={contributorCount}
            text={`Contributor${contributorCount === 1 ? '' : 's'}`}
            icon="ion-ios-people"
            fontColor={fontColor}
            bgColor={bgColor}
          />

        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};

export const ActivitySummaryView = ({model}) => {
  const data = {
    commitCount: model.data.commits,
    contributorCount: model.data.contributors,
    earliestCommit: model.data.earliest_commit,
    latestCommit: model.data.latest_commit
  };

  const context = model.context;

  return (
    <ActivitySummary
      {...{data, context}}
    />
  )
};


