import React from 'react';
import Contributors from "../../../contributors/context";
import Repositories from "../../../repositories/context";
import {CommitsTimelineChart} from "./index";
import Commits from "../../../commits/context";
import {Flex} from 'reflexbox';
import {CommitsTimelineRollupHeaderChart} from './commitsTimelineRollupHeader'
import {getCategoriesIndex} from "./utils";

function onCommitsSelected(context, commits) {
  if(commits && commits.length === 1) {
    const commit = commits[0];
    context.navigate(Commits, commit.name, commit.key)
  }
}

export class CommitsTimelineChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  onCategoriesSelected(selected) {
    this.setState({
      selectedCategories: selected
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = null;
    if(!prevState.selectedCategories) {
      state = {
        commits: nextProps.commits,
        selectedCategories: null
      }
    }
    return state;
  }



  getTimelineCommits(commits, category) {
    if(this.state.selectedCategories) {
      return commits.filter(
        commit => this.state.selectedCategories.find(
          cat =>
            cat === commit[category]
        )
      )
    } else {
      return commits
    }
  }


  render() {
    const {
      instanceKey,
      context,
      days,
      before,
      view,
      groupBy,
      shortTooltip,
      showHeader,
      markLatest,
      onSelectionChange,
      polling,

    } = this.props;
    const categoriesIndex = getCategoriesIndex(this.state.commits,groupBy, this.state.selectedCategories);
    const timelineCommits = this.getTimelineCommits(this.state.commits, categoriesIndex.category);
    return (
      <Flex column style={{height:"100%"}}>
        <Flex style={{height: showHeader ? "88%" : "100%"}} w={"100%"}>
          <CommitsTimelineChart
              commits={timelineCommits}
              context={context}
              instanceKey={instanceKey}
              view={view}
              groupBy={categoriesIndex.category}
              days={days}
              before={before}
              shortTooltip={shortTooltip}
              markLatest={markLatest}
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
                commits={this.state.commits}
                groupBy={categoriesIndex.category}
                onSelectionChange={this.onCategoriesSelected.bind(this)}
              />
            </Flex>
            : null
        }
      </Flex>
    )

  }

}