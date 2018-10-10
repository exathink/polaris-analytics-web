import React from 'react';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";
import {formatCommitDate, fromNow} from "../../../helpers/utility";

export const CommitDate = ({commit}) => (
  <RowNoOverflow title={formatCommitDate(commit.commitDate)} align={"center"}>
    <i className={"ion ion-clock"} style={{margin: '5px'}}/>
    <span>Committed {fromNow(commit.commitDate)}</span>
  </RowNoOverflow>
);