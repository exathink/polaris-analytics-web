import React from 'react';
import moment from "moment";
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

export const CommitDate = ({commit}) => (
  <RowNoOverflow align={"center"}>
    <i className={"ion ion-clock"} style={{margin: '5px'}}/>
    <span>{moment(`${commit.commitDate}Z`).format("dddd MM/DD/YYYY hh:mm a")}</span>
  </RowNoOverflow>
);