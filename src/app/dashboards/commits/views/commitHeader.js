import React from 'react';
import {VizItem, VizRow} from "../../shared/containers/layout";
import StickerWidget from "../../shared/containers/stickers/simpleSticker/sticker-widget";
import {Contexts} from "../../../meta";
import {url_for_instance} from "../../../framework/navigation/context/helpers";
import Contributors from "../../contributors/context";
import {formatCommitDate, fromNow} from "../../../helpers/utility";

export const CommitHeader = ({commit, context, view}) => (
    <React.Fragment>
      <VizRow h={"100%"}>
        <VizItem w={1 / 2}>

          {/* Sticker Widget */}
          <StickerWidget
            number={'Author'}
            text={commit.author}
            icon={Contexts.contributors.icon}
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
            link={url_for_instance(Contributors, commit.author, commit.authorKey)}
          />
        </VizItem>
        <VizItem w={1 / 2}>

          {/* Sticker Widget */}
          <StickerWidget
            number={'Authored'}
            hoverText={formatCommitDate(commit.authorDate)}
            text={fromNow(commit.authorDate)}
            icon={'ion-clock'}
            fontColor={"#ffffff"}
            bgColor={Contexts.commits.color}
          />
        </VizItem>
      </VizRow>
    </React.Fragment>
);

