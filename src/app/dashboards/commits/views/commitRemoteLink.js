import React from 'react';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

function getRepoBrowseUrl(repoUrl, integrationType){
  if(repoUrl){
    if (repoUrl.startsWith('https://github.com')) {
      return [repoUrl.replace(/.git$/, ''), 'Github']
    } else if (repoUrl.startsWith('git@github.com')) {
      return [repoUrl.replace(/^git@github.com:/, 'https://github.com/').replace(/.git$/, ''), 'Github']
    } else if (repoUrl.startsWith('git@gitlab.com')) {
      return [repoUrl.replace(/^git@gitlab.com:/, 'https://gitlab.com/').replace(/.git$/, ''), 'Gitlab']
    } else if (integrationType === 'gitlab') {
      return [repoUrl.replace(/.git$/, ''), 'Gitlab']
    }
    else if (repoUrl.match(/https:\/\/(.*)@bitbucket.org/)) {
        return [repoUrl.replace(/.git$/,''), 'BitBucket']
    }
    else return [undefined, undefined]
  }
}

function getCommitBrowseUrl(repoUrl, integrationType, commitHash) {
  if(commitHash && repoUrl) {
    const [repoBrowseUrl, source] = getRepoBrowseUrl(repoUrl, integrationType);
    if ('Github' === source || 'Gitlab' === source) {
      return [`${repoBrowseUrl}/commit/${commitHash}`, source]
    } else if('BitBucket' === source) {
      return [`${repoBrowseUrl}/commits/${commitHash}`, source]
    }
  }
  return [undefined, undefined]
}

export const CommitRemoteLink = ({commit}) => {
  const [commitBrowseUrl, source] = getCommitBrowseUrl(commit.repositoryUrl, commit.integrationType, commit.commitHash);

   return  (
     commitBrowseUrl ?
      <a href={commitBrowseUrl} target={"_blank"} title={`View commit on ${source}`}>
        <RowNoOverflow align={'center'}>
          <i className={"ion ion-link"} style={{margin: '5px'}}/>
          <span>{source}</span>
        </RowNoOverflow>
      </a>
       : null
   );
};