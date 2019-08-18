import React from 'react';
import {CommitsTimelineChart, CommitsTimelineTable} from "./index";
import Commits from "../../../commits/context";
import {Box, Flex} from 'reflexbox';
import {CommitsTimelineRollupBarChart} from './commitsTimelineRollupBarchart'
import {CommitTimelineChartModel} from "./commitTimelineChartModel";
import {CommitTimelineRollupSelector} from "./commitTimelineGroupSelector";
import {VizStickerWidget} from "../../containers/stickers/vizSticker/vizStickerWidget";


export class CommitsTimelineChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: new CommitTimelineChartModel(props.commits, props.groupBy),
      selectedGrouping: props.groupBy,
      selectedCategories: null,
      selectedCommits: null
    }
  }

  onGroupingChanged(groupBy) {
    this.setState({
      model: new CommitTimelineChartModel(this.props.commits, groupBy),
      selectedGrouping: groupBy,
      selectedCategories: null,
      selectedCommits: null
    })
  }


  onCategoriesSelected(selected) {
    const {
      commits,
      onSelectionChange,
    } = this.props;

    const model = new CommitTimelineChartModel(commits, this.state.selectedGrouping, selected)
    this.setState({
      ...this.state,
      model: model,
      selectedCategories: selected
    });
    if (onSelectionChange) {
      onSelectionChange(model.commits)
    }
  }

  navigateToCommit(commits) {
    const {
      context
    } = this.props;

    if (commits && commits.length === 1) {
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

    if (onSelectionChange) {
      onSelectionChange(commits)
    } else if (view !== 'detail' || !showTable) {
      this.navigateToCommit(commits)
    }
  }




  getCommitTimelineChart(model) {
    const {
      instanceKey,
      context,
      days,
      before,
      latestCommit,
      latest,
      totalCommits,
      view,
      shortTooltip,
      markLatest,
      polling,

    } = this.props;

    return (
      <CommitsTimelineChart
        model={model}
        context={context}
        instanceKey={instanceKey}
        view={view}
        days={days}
        before={before}
        latestCommit={latestCommit}
        latest={latest}
        totalCommits={totalCommits}
        shortTooltip={shortTooltip}
        markLatest={markLatest}
        polling={polling}
        onSelectionChange={this.onCommitsSelected.bind(this)}
        showScrollbar={true}
      />
    )
  }

  getTimelineRollupHeader() {
    const {commits} = this.props;
    return (
      <CommitsTimelineRollupBarChart
        model={new CommitTimelineChartModel(commits, this.state.selectedGrouping)}
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
          Object.keys(this.state.model.categoriesIndex).length > 1
        )
    );
  }


  getPrimaryLayout(height, model) {


    return (

      <Flex column style={{height: height, width: "100%"}}>
        <Flex column align='center' style={{height: "5%"}}>
          <CommitTimelineRollupSelector groupings={this.props.groupings}
                                        onGroupingChanged={this.onGroupingChanged.bind(this)}/>
        </Flex>
        <Flex style={{height: "95%"}}>
          <Box w={this.showHeader() ? "90%" : "100%"}>


            {
              this.getCommitTimelineChart(model)
            }

          </Box>
          {
            this.showHeader() ?
              <Box w={"10%"}>
                {
                  this.getTimelineRollupHeader()
                }
              </Box>
              : null
          }
        </Flex>
      </Flex>
    )
  }

  getDetailLayout(model, showHeader, showTable) {
    return (
      <Flex column style={{height: "100%", width: "100%"}}>
        {
          this.getPrimaryLayout(showTable ? "72%" : "100%", model)
        }
        {
          showTable ?
            <Flex style={{height: "28%", width: "100%"}}>
              {
                this.getTimelineTable(model.commits)
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
        this.getDetailLayout(this.state.model, showHeader, showTable)
        : this.getPrimaryLayout('95%', this.state.model, showHeader)
    )

  }

}