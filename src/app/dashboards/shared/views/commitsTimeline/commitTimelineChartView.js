import React from 'react';
import {CommitsTimelineChart, CommitsTimelineTable} from "./index";
import Commits from "../../../commits/context";
import {Box, Flex} from 'reflexbox';
import {CommitsTimelineRollupBarChart} from './commitsTimelineRollupBarchart'
import {GroupingSelector} from "../../components/groupingSelector/groupingSelector";
import {DaysRangeSlider} from "../../components/daysRangeSlider/daysRangeSlider";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";

const commitTimelineGroupings = {
  repository: "Repository",
  workItem: "Work Item",
  author: "Author",
  branch: "Branch"
}


export class CommitTimelineViewModel {
  constructor(commits, groupBy = 'author', filterCategories = null) {
    this.groupBy = groupBy;
    this.getCategories = this.initCategorySelector(groupBy)
    this.commits = filterCategories ? this.filter(commits, filterCategories) : commits
    this.traceability = this.commits.length > 0 ?
      this.commits.filter(commit => commit.workItemsSummaries.length > 0).length / this.commits.length
      : null
    this.categoriesIndex = this.initCategoryIndex(this.commits, groupBy, filterCategories)
  }


  initCategorySelector(groupBy) {
    if (groupBy !== 'workItem') {
      return (commit) => [commit[groupBy]]
    } else {
      return (commit) =>
        commit.workItemsSummaries.length > 0 ?
          commit.workItemsSummaries.map(
            workItem =>
              `${workItem.displayId}: ${workItem.name}`
          )
          : ["Untracked"]
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

export class CommitsTimelineChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commits: props.commits,
      model: new CommitTimelineViewModel(props.commits, props.groupBy),
      selectedGrouping: props.groupBy,
      selectedCategories: null,
      selectedCommits: null
    }
  }


  componentDidUpdate() {
    if (this.props.commits !== this.state.commits) {
      this.setState({
        commits: this.props.commits,
        model: new CommitTimelineViewModel(this.props.commits, this.state.selectedGrouping),
      })
    }
  }

  onGroupingChanged(groupBy) {
    this.setState({
      model: new CommitTimelineViewModel(this.props.commits, groupBy),
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

    const model = new CommitTimelineViewModel(commits, this.state.selectedGrouping, selected)
    this.setState({
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
    const {model} = this.state;


    return (
      <div style={{height: "100%"}}>
        <div style={{
          height: "18%",
          backgroundColor: '#f2f3f6',
          borderColor: 'GhostWhite',
          borderStyle: 'solid',
          borderWidth: '2px'
        }}>
          <Statistic
            title="Traceability"
            value={model.traceability != null ? model.traceability * 100 : 'N/A'}
            precision={model.traceability != null && 2}
            valueStyle={{color: '#3f8600'}}

            suffix={model.traceability != null && "%"}
            style={{backgroundColor: '#f2f3f6'}}
          />
        </div>
        <div style={{height: "82%"}}>
          <CommitsTimelineRollupBarChart
            /* We cannot use the model on state here because this should include all the categories
            *  even when some a selected*/
            model={new CommitTimelineViewModel(this.state.commits, this.state.selectedGrouping)}
            onSelectionChange={this.onCategoriesSelected.bind(this)}
          />
        </div>
      </div>
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
    const {view, days, setDaysRange, groupings} = this.props;
    const {selectedGrouping} = this.state;

    const showSlider = view === 'detail';

    return (
        <Flex column style={{height: height, width: "100%"}}>
          <Flex pl={1} pt={2} pb={2} pr={10} align='center' justify={showSlider ? 'left' : 'center'}
                style={{height: "5%"}}>
            {
              showSlider &&
              <Box w={"35%"}>
                <DaysRangeSlider initialDays={days} setDaysRange={setDaysRange}/>
              </Box>
            }
            {
              groupings &&
              <Box>
                <GroupingSelector
                  groupings={
                    groupings.map(
                      grouping => ({
                        key: grouping,
                        display: commitTimelineGroupings[grouping]
                      })
                    )
                  }
                  initialValue={selectedGrouping}
                  onGroupingChanged={this.onGroupingChanged.bind(this)}/>
              </Box>
            }
          </Flex>
          <Flex style={{height: "95%"}}>
            <Box w={"90%"}>
              {
                this.getCommitTimelineChart(model)
              }
            </Box>
            <Box w={"10%"}>
              {
                this.getTimelineRollupHeader()
              }
            </Box>
          </Flex>
        </Flex>
    )
  }

  getDetailLayout(model, showHeader) {
    return (
      <Flex column style={{height: "100%", width: "100%"}}>
        {
          this.getPrimaryLayout("72%", model)
        }
        {
          <Flex style={{height: "28%", width: "100%"}}>
            {
              this.getTimelineTable(model.commits)
            }
          </Flex>
        }
      </Flex>
    )
  }

  render() {
    const {
      view,
      showHeader
    } = this.props;

    return (
      <div style={{height: "100%", width: "100%"}}>

          {
            view === 'detail' ?
              this.getDetailLayout(this.state.model, showHeader)
              : this.getPrimaryLayout('100%', this.state.model, showHeader)
          }

      </div>
    )
  }

}