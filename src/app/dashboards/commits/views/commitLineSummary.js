import React from 'react';
import {VizItem, VizRow} from "../../shared/containers/layout";
import StickerWidget from "../../shared/containers/stickers/simpleSticker/sticker-widget";
import {Contexts} from "../../../meta";
import moment from "moment";
import {Chart} from "../../../framework/viz/charts";
import {VizStickerWidget} from "../../shared/containers/stickers/vizSticker/vizStickerWidget";


export const CommitLineSummary = ({commit, view}) => (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1}>
          {/* Sticker Widget */}
          <VizStickerWidget
            number={commit.stats.lines}
            text={'Lines'}
            icon="ion-code"
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
            showHeader={true}
          >
            <CommitLinesChart commit={commit}/>
          </VizStickerWidget>
        </VizItem>
      </VizRow>
    </React.Fragment>
);

const CommitLinesChart = Chart({
  chartUpdateProps:
    (props) => ({
      commit: props.commit
    }),
  getConfig:
    ({commit, view}) => {
      const series = [
        {
          id: '++',
          key: 'adds',
          name: 'Lines added',
          data: [commit.stats.insertions],
          color: "#28ff17"
        },
        {
          id: '--',
          key: 'deletes',
          name: 'Lines deleted',
          data: [commit.stats.deletions],
          color: "#ff5b0c"
        }

      ];

      return {
        chart: {
          type: 'bar'
        },
        plotOptions:{
          series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                align: 'center',
                formatter: function() {
                  const x = 3;
                  return `<b>${this.series.userOptions.id}</b>`
                },
              color: "#000000"
              }
          }
        },
        title: {
          text: null
        },
        xAxis: {
          categories: [''],
          visible: false,
          allowDecimals: false
        },
        yAxis: {
          title: {
            text: null
          },
          visible: true
        },
        series: series,
        legend: {
          enabled: false
        }
      }
    }
});