import React from 'react';
import {CommitsTimelineChart, CommitsTimelineTable} from "./index";
import Commits from "../../../commits/context";
import {Box, Flex} from 'reflexbox';
import {CommitsTimelineRollupBarChart} from './commitsTimelineRollupBarchart'
import {GroupingSelector} from "../../components/groupingSelector/groupingSelector";
import {DaysRangeSlider} from "../../components/daysRangeSlider/daysRangeSlider";
import {VizRow} from "../../containers/layout";
import {Untracked} from "../../config";
import {HumanizedDateView} from "../../components/humanizedDateView/humanizedDateView";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import { ComponentCarousel } from "../../components/componentCarousel/componentCarousel";
import {Traceability } from "../../components/flowStatistics/flowStatistics";

const commitTimelineGroupings = {
  repository: "Repository",
  workItem: "Spec",
  author: "Author",
  branch: "Branch",
  team: "Team"
}

export const HeaderMetrics = {
  traceability: 'traceability',
  latestCommit: 'latestCommit'
}

export class CommitTimelineViewModel {
  constructor(commits, groupBy = 'author', filterCategories = null) {
    this.groupBy = groupBy;
    this.getCategories = this.initCategorySelector(groupBy);
    this.mapCategoryToNode = this.initCategoryReverseMapper(groupBy);
    this.commits = filterCategories ? this.filter(commits, filterCategories) : commits;
    this.totalCommits = this.commits.length > 0;
    this.traceability = this.commits.length > 0 ?
      this.commits.filter(commit => commit.workItemsSummaries.length > 0).length / this.commits.length
      : null;
    this.categoriesIndex = this.initCategoryIndex(this.commits, groupBy, filterCategories);
  }


  initCategorySelector(groupBy) {
    if (["repository", "author"].indexOf(groupBy) !== -1) {
      return (commit) => [commit[groupBy]];
    } else if (groupBy === "team") {
      return (commit) => [commit.authorTeamName || "Unassigned", commit.committerTeamName || "Unassigned"];
    } else if (groupBy === "branch") {
      return (commit) => [`${commit.repository}/${commit.branch}`];
    } else {
      return (commit) =>
        commit.workItemsSummaries.length > 0
          ? commit.workItemsSummaries.map((workItem) => `${workItem.displayId}: ${workItem.name}`)
          : [Untracked];
    }
  }

  initCategoryReverseMapper(groupBy) {
    if (groupBy !== 'workItem') {
      return (commits, category) => {
        let commit;
        commit = commits.find(commit => commit[groupBy] === category);
        if (groupBy === "team") {
          commit = commits.find(commit => commit["authorTeamName"] === category);
        }
        if (commit) {
          switch (groupBy) {
            case 'author': {
              return [commit.author, commit.authorKey];

            }
            case 'repository': {
              return [commit.repository, commit.repositoryKey]
            }
            case 'team': {
              return [commit.authorTeamName, commit.authorTeamKey]
            }
            default: {
              break
            }
          }
        }
        return [];
      }
    } else {
      return (commits, workItemDisplay) => {
        const workItem = commits.flatMap(
          commit => commit.workItemsSummaries
        ).find(
          workItem => (workItem != null) && `${workItem.displayId}: ${workItem.name}` === workItemDisplay
        );
        if (workItem) {
          return [workItem.displayId, workItem.key, workItem.stateType, workItem.state, workItem.workItemType]
        } else {
          return []
        }
      }
    }
  }


  filter(commits, filterCategories) {
    return commits.filter(
      commit => this.getCategories(commit).some(
        category => filterCategories.indexOf(category) !== -1
      )
    )
  }

  initCategoryIndex(commits, groupBy, filterCategories) {
    let categoryIndex = {}
    for (let i = 0; i < commits.length; i++) {
      const categories = this.getCategories(commits[i]);
      for (let j = 0; j < categories.length; j++) {

        const category = categories[j];
        // If we are filtering categories then the ones that are not in the
        // filter should not be in the index.
        if (filterCategories != null && filterCategories.indexOf(category) === -1) {
          break;
        }
        // if we are seeing this category for the first time then initialize with a commit count of 1
        if (categoryIndex[category] === undefined) {
          categoryIndex[category] = 1
        } else {
          // Add to the commit count of the category.
          categoryIndex[category] = categoryIndex[category] + 1
        }
      }
    }
    return categoryIndex;
  }
}


class _CommitsTimelineChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commits: props.commits,
      model: new CommitTimelineViewModel(props.commits, props.groupBy),
      selectedGrouping: props.groupBy,
      selectedCategories: null,
      selectedCommits: null,
    };
  }

  componentDidUpdate() {
    if (this.props.commits !== this.state.commits) {
      this.setState({
        commits: this.props.commits,
        model: new CommitTimelineViewModel(this.props.commits, this.state.selectedGrouping),
      });
    }
  }

  onGroupingChanged(groupBy) {
    this.setState({
      model: new CommitTimelineViewModel(this.props.commits, groupBy),
      selectedGrouping: groupBy,
      selectedCategories: null,
      selectedCommits: null,
    });
  }

  onCategoriesSelected(selected) {
    const {commits, onSelectionChange} = this.props;

    const model = new CommitTimelineViewModel(commits, this.state.selectedGrouping, selected);
    this.setState({
      model: model,
      selectedCategories: selected,
      selectedCommits: null,
    });
    if (onSelectionChange) {
      onSelectionChange(model.commits);
    }
  }

  navigateToCommit(commits) {
    const {context} = this.props;

    if (commits && commits.length === 1) {
      const commit = commits[0];
      context.navigate(Commits, commit.name, commit.key);
    }
  }

  onCommitsSelected(commits) {
    const {onSelectionChange, showTable, view} = this.props;

    // we set this state to suppress further
    // updates to props.commits until selections are done.
    // The selections also feed the commits table if its being shown.
    this.setState({
      selectedCommits: commits,
    });

    if (onSelectionChange) {
      onSelectionChange(commits);
    } else if (view !== "detail" || !showTable) {
      this.navigateToCommit(commits);
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
      excludeMerges,
      onCategoryItemSelected,
      polling,
      fullScreen,
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
        excludeMerges={excludeMerges}
        polling={polling}
        fullScreen={fullScreen}
        onSelectionChange={this.onCommitsSelected.bind(this)}
        onCategoryItemSelected={onCategoryItemSelected}
        showScrollbar={true}
      />
    );
  }

  getTimelineRollupHeader() {
    const {model} = this.state;
    const {latestCommit} = this.props;

    return (
      <div style={{height: "100%"}}>
        <div
          style={{
            height: "18%",
            backgroundColor: "#f2f3f6",
            borderColor: "GhostWhite",
            borderStyle: "solid",
            borderWidth: "2px",
          }}
        >
          <ComponentCarousel tickInterval={3000}>
            <HumanizedDateView title={"Latest Commit"} dateValue={latestCommit} asStatistic={true} />
            <Traceability current={model} previous={model} />
          </ComponentCarousel>
        </div>
        <div className="tw-relative tw-h-[82%]">
          <div className="tw-absolute tw-inset-0" data-testid="commits_timeline_rollup">
            <CommitsTimelineRollupBarChart
              /* We cannot use the model on state here because this should include all the categories
               *  even when some a selected*/
              model={new CommitTimelineViewModel(this.state.commits, this.state.selectedGrouping)}
              onSelectionChange={this.onCategoriesSelected.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

  getTimelineTable(commits) {
    return <CommitsTimelineTable commits={this.state.selectedCommits || commits} />;
  }

  showHeader() {
    const {showHeader} = this.props;

    return this.state.selectedCategories
      ? showHeader
      : showHeader && Object.keys(this.state.model.categoriesIndex).length > 1;
  }

  getPrimaryLayout(height, model) {
    const {view, days, setDaysRange, groupings} = this.props;
    const {selectedGrouping} = this.state;

    const showSlider = days && view === "detail";

    return (
      <Flex column style={{height: height, width: "100%"}}>
        <Flex
          pl={1}
          pt={2}
          pb={2}
          pr={10}
          align="center"
          justify={showSlider ? "left" : "center"}
          style={{height: "5%"}}
        >
          {showSlider && (
            <Box w={"35%"}>
              <DaysRangeSlider initialDays={days} setDaysRange={setDaysRange} />
            </Box>
          )}
          {groupings && (
            <Box>
              <GroupingSelector
                groupings={groupings.map((grouping) => ({
                  key: grouping,
                  display: commitTimelineGroupings[grouping],
                }))}
                initialValue={selectedGrouping}
                onGroupingChanged={this.onGroupingChanged.bind(this)}
              />
            </Box>
          )}
        </Flex>
        <Flex style={{height: "95%"}}>
          <Box w={"90%"}>{this.getCommitTimelineChart(model)}</Box>
          <Box w={"10%"}>{this.getTimelineRollupHeader()}</Box>
        </Flex>
      </Flex>
    );
  }

  getDetailLayout(model, showHeader) {
    return (
      <Flex column style={{height: "100%", width: "100%"}}>
        {this.getPrimaryLayout("72%", model)}
        {<Flex style={{height: "28%", width: "100%"}}>{this.getTimelineTable(model.commits)}</Flex>}
      </Flex>
    );
  }

  render() {
    const {view, showHeader} = this.props;

    return (
      <VizRow h={1}>
        {view === "detail"
          ? this.getDetailLayout(this.state.model, showHeader)
          : this.getPrimaryLayout("100%", this.state.model, showHeader)}
      </VizRow>
    );
  }
}

export const CommitsTimelineChartView = withNavigationContext(_CommitsTimelineChartView);