import React from 'react';
import {VizItem, VizRow} from "../../shared/containers/layout";
import StickerWidget from "../../shared/containers/stickers/simpleSticker/sticker-widget";
import {Contexts} from "../../../meta";
import moment from "moment";


export const CommitFileSummary = ({commit, view}) => (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1}>
          {/* Sticker Widget */}
          <StickerWidget
            number={commit.stats.files}
            text={'Files'}
            icon="ion-code"
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
);

