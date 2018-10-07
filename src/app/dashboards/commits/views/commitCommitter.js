import React from 'react';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";
import {url_for_instance} from "../../../framework/navigation/context/helpers";
import Contributors from "../../contributors/context";
import {Link} from 'react-router-dom';

export const CommitCommitter = ({commit}) => (
    <RowNoOverflow align={'center'}>
      <Link to={url_for_instance(Contributors, commit.commiter, commit.committerKey)} title={"Committer"}>
        <i className={"ion ion-code"} style={{margin: '5px'}}/>
        <span>{commit.committer}</span>
      </Link>
    </RowNoOverflow>
);