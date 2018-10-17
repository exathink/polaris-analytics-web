import React from 'react';
import {CommitsTimelineChart, CommitsTimelineTable} from "./index";
import Commits from "../../../commits/context";
import {Box, Flex} from 'reflexbox';
import {CommitsTimelineRollupHeaderChart} from './commitsTimelineRollupHeader'
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
      groupBy,
      smartGrouping,
    } = this.props;
    const categoriesIndex = getCategoriesIndex(this.state.commits, groupBy, smartGrouping, selected);
    const timelineCommits = getTimelineCommits(this.state.commits, categoriesIndex.category, selected);
    this.setState({
      ...this.state,
      categoriesIndex,
      timelineCommits,
      selectedCategories: selected,
    });
  }

  navigateToCommit(commits) {
    const {
      context
    } = this.props;

    if ( commits && commits.length === 1) {
      const commit = commits[0];
      context.navigate(Commits, commit.name, commit.key)
    }
  }

  onCommitsSelected(commits) {
    const {
      onSelectionChange,
      showTable,
      view,
    } = this.props;

    // we set this state to suppress further
    // updates to props.commits until selections are done.
    // The selections also feed the commits table if its being shown.
    this.setState({
      ...this.state,
      selectedCommits: commits,
    });

    if(onSelectionChange) {
        onSelectionChange(commits)
    } else if(view !== 'detail' || !showTable) {
      this.navigateToCommit(commits)
    }
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      commits,
      groupBy,
      smartGrouping
    } = nextProps;

    let state = null;
    if (!prevState.selectedCategories && !prevState.selectedCommits) {
      if (prevState.commits !== nextProps.commits) {
        const categoriesIndex = getCategoriesIndex(commits, groupBy, smartGrouping);
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
      latest,
      totalCommits,
      view,
      shortTooltip,
      markLatest,
      showHeader,
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
        latest={latest}
        totalCommits={totalCommits}
        shortTooltip={shortTooltip}
        markLatest={markLatest}
        polling={polling}
        categoryIndex={categoriesIndex}
        onSelectionChange={this.onCommitsSelected.bind(this)}
        showScrollbar={true}
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
    const {
      showHeader
    } = this.props;

    return (
      this.state.selectedCategories ?
        showHeader
        :
        (
          showHeader &&
          Object.keys(this.state.categoriesIndex.categories_index).length > 1
        )
    );
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