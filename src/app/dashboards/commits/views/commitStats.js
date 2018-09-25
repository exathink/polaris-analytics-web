import React from 'react';
import {VizItem, VizRow} from "../../shared/containers/layout";
import {VizStickerWidget} from "../../shared/containers/stickers/vizSticker/vizStickerWidget";
import {ActivityProfileBarChart} from "../../shared/views/activityProfile/components";
import StickerWidget from "../../shared/containers/stickers/simpleSticker/sticker-widget";
import {Contexts} from "../../../meta";
import {human_span} from "../../../helpers/utility";
import moment from "moment";


export const CommitStats = ({commit, view}) => (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 2}>

          {/* Sticker Widget */}
          <StickerWidget
            number={commit.author}
            text={'Author'}
            icon={Contexts.contributors.icon}
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
          />
        </VizItem>
        <VizItem w={1 / 2}>

          {/* Sticker Widget */}
          <StickerWidget
            number={moment(commit.commitDate).fromNow()}
            text={'Commit Date'}
            icon={'ion-clock'}
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
);

