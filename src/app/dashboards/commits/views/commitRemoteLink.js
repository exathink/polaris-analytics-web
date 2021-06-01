import React from 'react';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";
import {getCommitBrowseUrl} from "../../shared/helpers/commitUtils";

export const CommitRemoteLink = ({commit}) => {
  const [commitBrowseUrl, source] = getCommitBrowseUrl(commit.repositoryUrl, commit.integrationType, commit.commitHash);

   return  (
     commitBrowseUrl ?
      <a href={commitBrowseUrl} target={"_blank"} rel="noopener noreferrer" title={`View commit on ${source}`}>
        <RowNoOverflow align={'center'}>
          <i className={"ion ion-link"} style={{margin: '5px'}}/>
          <span>{source}</span>
        </RowNoOverflow>
      </a>
       : null
   );
};