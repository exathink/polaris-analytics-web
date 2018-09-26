import React from 'react';
import {VizItem, VizRow} from "../../shared/containers/layout";
import {Contexts} from "../../../meta";
import {VizStickerWidget} from "../../shared/containers/stickers/vizSticker/vizStickerWidget";
import {FileTypesSummaryChart} from "../../shared/views/fileTypesSummary/fileTypesSummaryChart";

export const CommitFileSummary = ({commit, view}) => (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1}>
          {/* Sticker Widget */}
          <VizStickerWidget
            number={commit.stats.files}
            text={'Files'}
            icon="ion-code"
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
            showHeader={true}
          >
            <FileTypesSummaryChart fileTypesSummary={commit.fileTypesSummary}/>
          </VizStickerWidget>
        </VizItem>
      </VizRow>
    </React.Fragment>
);

