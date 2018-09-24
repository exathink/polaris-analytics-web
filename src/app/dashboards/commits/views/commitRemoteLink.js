import React from 'react';
import {RowNoOverflow} from "../../shared/containers/flex/rowNoOverflow";

function getRepoBrowseUrl(repoUrl){
  if(repoUrl){
    if (repoUrl.startsWith('https://github.com')) {
      return [repoUrl.replace(/.git$/, ''), 'Github']
    } else if (repoUrl.startsWith('git@github.com')) {
      return [repoUrl.replace(/^git@github.com:/, 'https://github.com/').replace(/.git$/, ''), 'Github']
    } else if (repoUrl.startsWith('git@gitlab.com')) {
      return [repoUrl.replace(/^git@gitlab.com:/, 'https://gitlab.com/').replace(/.git$/, ''), 'Gitlab']
    } else if (repoUrl.startsWith('https://gitlab.com')) {
      return [repoUrl.replace(/.git$/, ''), 'Gitlab']
    } else return [undefined, undefined]
  }
}

function getCommitBrowseUrl(repoUrl, commitHash) {
  if(commitHash && repoUrl) {
    const [repoBrowseUrl, source] = getRepoBrowseUrl(repoUrl);
    if ('Github' === source || 'Gitlab' === source) {
      return [`${repoBrowseUrl}/commit/${commitHash}`, source]
    }
  }
  return [undefined, undefined]
}

export const CommitRemoteLink = ({commit}) => {
  const [commitBrowseUrl, source] = getCommitBrowseUrl(commit.repositoryUrl, commit.commitHash);

   return  (
     commitBrowseUrl ?
      <a href={commitBrowseUrl} target={"_blank"} style={{color: 'black'}}>
        <RowNoOverflow align={'center'}>
          <i className={"ion ion-link"} style={{margin: '5px'}}/>
          <span>{source}</span>
        </RowNoOverflow>
      </a>
       : null
   );
};