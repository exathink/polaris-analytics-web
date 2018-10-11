import React from 'react';
import Contributors from "../../../contributors/context";
import Repositories from "../../../repositories/context";
import {CommitsTimelineChart} from "./index";
import Commits from "../../../commits/context";
import {Flex, Box} from 'reflexbox';
import {CommitsTimelineRollupHeaderChart} from './commitsTimelineRollupHeader'
import {CommitsTimelineTable} from "./index";
import {getCategoriesIndex} from "./utils";

function onCommitsSelected(context, commits) {
  if (commits && commits.length === 1) {
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
    if (!prevState.selectedCategories) {
      state = {
        commits: nextProps.commits,
        selectedCategories: null
      }
    }
    return state;
  }

  getCommitTimelineChart(timelineCommits, categoriesIndex) {
    const {
      instanceKey,
      context,
      days,
      before,
      view,
      shortTooltip,
      markLatest,
      onSelectionChange,
      polling,

    } = this.props;

    return (
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
    )
  }

  getTimelineRollupHeader(category) {
    return (
      <CommitsTimelineRollupHeaderChart
        commits={this.state.commits}
        groupBy={category}
        onSelectionChange={this.onCategoriesSelected.bind(this)}
      />
    )
  }


  getTimelineTable(commits) {
    return (
      <CommitsTimelineTable
        commits={commits}
      />
    )
  }

  getTimelineCommits(commits, category) {
    if (this.state.selectedCategories) {
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



  getPrimaryLayout(height, categoriesIndex, timelineCommits) {
    const {
      showHeader
    } = this.props;

    return (
      <Flex style={{height: height, width:"100%"}}>
        <Box w={showHeader? "90%" : "100%"}>
          {
            this.getCommitTimelineChart(timelineCommits, categoriesIndex)
          }
        </Box>
        {
          showHeader?
            <Box w={"10%"}>
              {
                this.getTimelineRollupHeader(categoriesIndex.category)
              }
            </Box>
            : null
        }
      </Flex>
    )
  }

  getDetailLayout(categoriesIndex, timelineCommits, showHeader, showTable){
    return (
      <Flex column style={{height: "100%", width: "100%"}}>
        {
          this.getPrimaryLayout(showTable ? "72%" : "100%", categoriesIndex, timelineCommits, showHeader)
        }
        {
          showTable ?
            <Flex style={{height: "28%", width: "100%"}}>
              {
                this.getTimelineTable(timelineCommits)
              }
            </Flex>
            :null
        }
      </Flex>
    )
  }

  render() {
    const {
      view,
      groupBy,
      showHeader,
      showTable,
    } = this.props;

    const categoriesIndex = getCategoriesIndex(this.state.commits, groupBy, this.state.selectedCategories);
    const timelineCommits = this.getTimelineCommits(this.state.commits, categoriesIndex.category);
    return (
       view === 'detail' ?
         this.getDetailLayout(categoriesIndex, timelineCommits, showHeader, showTable)
         : this.getPrimaryLayout('95%', categoriesIndex, timelineCommits, showHeader)
    )

  }

}