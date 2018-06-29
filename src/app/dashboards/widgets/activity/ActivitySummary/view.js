import React from 'react';
import StickerWidget from '../../containers/widgets/simpleSticker/sticker-widget';
import {VizItem, VizRow} from "../../containers/layout/index";
import moment from 'moment';
import {ActivitySummaryModel} from "./model";

const human_span = (moment_a, moment_b) => {
  const span = moment.duration(moment_a.diff(moment_b));
  const years = span.years();
  const d_years = `${years > 0 ? years + (years > 1 ? ' Years' : ' Year'): ''}`;

  const months = span.months();
  const d_months = `${months > 0 ? months + (months > 1 ? ' Months': ' Month'): ''}`;
  return years+months > 0 ? `${d_years}${(years > 0 ? ', ' : '')}${d_months}` : '0 Years';
};

export const ActivitySummaryView = (props: {model: ActivitySummaryModel}) => {

  const {model}  = props;
  const data = model.data;
  const commits = data.commits? data.commits.toLocaleString() : '0';
  const contributors = (data.contributors? data.contributors.toLocaleString() : '0');
  const span = (data.latest_commit && data.earliest_commit ? human_span(data.latest_commit, data.earliest_commit) : 'N/A');
  const bgColor = model.context.color();
  const fontColor = "#ffffff";
  return (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1/3}>

            {/* Sticker Widget */}
            <StickerWidget
              number={commits}
              text={"Commits"}
              icon="ion-code"
              fontColor={fontColor}
              bgColor={bgColor}
            />

        </VizItem>
        <VizItem w={1/3}>

            {/* Sticker Widget */}
            <StickerWidget
              number={span}
              text={'History'}
              icon="ion-clock"
              fontColor={fontColor}
              bgColor={bgColor}
            />

        </VizItem>
        <VizItem w={1/3}>

            {/* Sticker Widget */}
            <StickerWidget
              number={contributors}
              text={`Contributor${data.contributors === 1 ? '' : 's'}`}
              icon="ion-ios-people"
              fontColor={fontColor}
              bgColor={bgColor}
            />

        </VizItem>
      </VizRow>
    </React.Fragment>
  )
};
