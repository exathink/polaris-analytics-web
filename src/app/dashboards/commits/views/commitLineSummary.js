import React from 'react';
import {VizItem, VizRow} from "../../shared/containers/layout";
import {Contexts} from "../../../meta";
import {VizStickerWidget} from "../../shared/containers/stickers/vizSticker/vizStickerWidget";
import {CommitLinesSummaryChart} from "./commitLinesSummaryChart";


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
            <CommitLinesSummaryChart commit={commit}/>
          </VizStickerWidget>
        </VizItem>
      </VizRow>
    </React.Fragment>
);

