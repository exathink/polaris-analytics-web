import React from 'react';
import Contributors from "../../../contributors/context";
import Repositories from "../../../repositories/context";
import {CommitsTimelineChart} from "./index";
import Commits from "../../../commits/context";
import {Flex, Box} from 'reflexbox';
import {CommitsTimelineRollupHeaderChart} from './commitsTimelineRollupHeader'
import {CommitsTimelineTable} from "./index";
import {getCategoriesIndex} from "./utils";


function getTimelineCommits(commits, category, selectedCategories) {
  let timelineCommits = commits;
  if (selectedCategories) {
    timelineCommits = commits.filter(
      commit => selectedCategories.find(
        cat =>
          cat === commit[category]
      )
    )
  }
  return timelineCommits
}

export class CommitsTimelineChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  onCategoriesSelected(selected) {
    const {
      groupBy
    } = this.props;
    const categoriesIndex = getCategoriesIndex(this.state.commits, groupBy,selected);
    const timelineCommits = getTimelineCommits(this.state.commits, categoriesIndex.category, selected);
    this.setState({
      ...this.state,
      categoriesIndex,
      timelineCommits,
      selectedCategories: selected,
    });
  }

  onCommitsSelected(commits) {
    const {
      context,
      view,
      showTable
    } = this.props;

    if (view === 'detail' && showTable) {
      this.setState({
        ...this.state,
        selectedCommits: commits,
      })

    } else if (commits && commits.length === 1) {
      const commit = commits[0];
      context.navigate(Commits, commit.name, commit.key)
    }
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      commits,
      groupBy
    } = nextProps;

    let state = null;
    if (!prevState.selectedCategories && !prevState.selectedCommits) {
      if (prevState.commits !== nextProps.commits) {
        const categoriesIndex = getCategoriesIndex(commits, groupBy);
        const timelineCommits = getTimelineCommits(commits, categoriesIndex.category);
        state = {
          commits,
          categoriesIndex,
          timelineCommits,
          selectedCategories: null,
          selectedCommits: null
        }
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
          onSelectionChange || this.onCommitsSelected.bind(this)
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
        commits={this.state.selectedCommits || commits}
      />
    )
  }

  showHeader() {
    return this.props.showHeader && this.state.categoriesIndex.categories_index.length > 1;
  }


  getPrimaryLayout(height, categoriesIndex, timelineCommits) {


    return (
      <Flex style={{height: height, width: "100%"}}>
        <Box w={this.showHeader() ? "90%" : "100%"}>
          {
            this.getCommitTimelineChart(timelineCommits, categoriesIndex)
          }
        </Box>
        {
          this.showHeader() ?
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

  getDetailLayout(categoriesIndex, timelineCommits, showHeader, showTable) {
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
            : null
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

    return (
      view === 'detail' ?
        this.getDetailLayout(this.state.categoriesIndex, this.state.timelineCommits, showHeader, showTable)
        : this.getPrimaryLayout('95%', this.state.categoriesIndex, this.state.timelineCommits, showHeader)
    )

  }

}