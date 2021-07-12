import React from 'react';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";
import {getCommitBrowseUrl} from "../../shared/helpers/commitUtils";
import {Button} from "antd";

export const CommitRemoteLink = ({commit}) => {
  const [commitBrowseUrl, source] = getCommitBrowseUrl(commit.repositoryUrl, commit.integrationType, commit.commitHash);

   return  (
     commitBrowseUrl ?
      <a href={commitBrowseUrl} target={"_blank"} rel="noopener noreferrer" title={`View commit on ${source}`}>
        <RowNoOverflow align={'center'}>
          <Button type="primary" size="small" style={{margin: "0 0 10px 15px"}}>
            View on {source}
          </Button>
        </RowNoOverflow>
      </a>
       : null
   );
};