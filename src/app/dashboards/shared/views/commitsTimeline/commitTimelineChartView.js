import React from 'react';
import Contributors from "../../../contributors/context";
import Repositories from "../../../repositories/context";
import {CommitsTimelineChart} from "./index";
import Commits from "../../../commits/context";
import {Flex} from 'reflexbox';
import {CommitsTimelineRollupHeaderChart} from './commitsTimelineRollupHeader'
import {getCategoriesIndex} from "./utils";

function onCommitsSelected(context, commits) {
  if(commits.length === 1) {
    const commit = commits[0];
    context.navigate(Commits, commit.name, commit.key)
  }
}

export class CommitsTimelineChartView extends React.Component {


  render() {
    const {
      commits,
      instanceKey,
      context,
      days,
      before,
      view,
      groupBy,
      shortTooltip,
      showHeader,
      onSelectionChange,
      polling,

    } = this.props;
    const categoriesIndex = getCategoriesIndex(commits,groupBy);

    return (
      <Flex column style={{height:"100%"}}>
        <Flex style={{height: showHeader ? "88%" : "100%"}} w={"100%"}>
          <CommitsTimelineChart
              commits={commits}
              context={context}
              instanceKey={instanceKey}
              view={view}
              groupBy={categoriesIndex.category}
              days={days}
              before={before}
              shortTooltip={shortTooltip}
              polling={polling}
              categoryIndex={categoriesIndex}
              onSelectionChange={
                onSelectionChange || (commits => onCommitsSelected(context, commits))
              }
              onAuthorSelected={
                (authorName, authorKey) => context.navigate(Contributors, authorName, authorKey)
              }
              onRepositorySelected={
                (repositoryName, repositoryKey) => context.navigate(Repositories, repositoryName, repositoryKey)
              }
          />
        </Flex>
        {
          showHeader ?
            <Flex style={{height:"12%"}} w={"100%"}>
              <CommitsTimelineRollupHeaderChart
                commits={commits}
                groupBy={categoriesIndex.category}
                categoriesIndex={categoriesIndex}
              />
            </Flex>
            : null
        }
      </Flex>
    )

  }

}