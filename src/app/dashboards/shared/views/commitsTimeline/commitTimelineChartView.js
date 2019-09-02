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
    this.getCategory = this.initCategorySelector(groupBy)
    this.commits = filterCategories ? this.filter(commits, filterCategories) : commits
    this.traceability = this.commits.length > 0 ?
      this.commits.filter(commit=>commit.workItemsSummaries.length > 0).length / this.commits.length
      : null
    this.categoriesIndex = this.initCategoryIndex(this.commits, groupBy, filterCategories)
  }


  initCategorySelector(groupBy) {
    if (groupBy !== 'workItem') {
      return (commit) => commit[groupBy]
    } else {
      // Does not handle commits that are attached to multiple issues. leaving it as it is for now
      // since that is not likely a very common scenario. Revisit if that changes.
      return (commit) => commit.workItemsSummaries.length > 0 ? `${commit.workItemsSummaries[0].name}` : "Untracked"
    }
  }

  filter(commits, filterCategories) {
    return commits.filter(commit => filterCategories.indexOf(this.getCategory(commit)) !== -1)
  }

  initCategoryIndex(commits, groupBy, filterCategories) {
    return commits.reduce(
      (index, commit) => {
        const category = this.getCategory(commit);
        if (index[category] === undefined) {
          index[category] = 1
        } else {
          index[category] = index[category] + 1
        }
        return index
      },
      {}
    );
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
          height: "15%",
          backgroundColor: '#f2f3f6',
          borderColor: 'GhostWhite',
          borderStyle: 'solid',
          borderWidth: '2px'
        }}>
          <Statistic
            title="Traceability"
            value={ model.traceability != null ? model.traceability * 100 : 'N/A'}
            precision={model.traceability != null && 2}
            valueStyle={{ color: '#3f8600'}}

            suffix={model.traceability != null && "%"}
            style={{backgroundColor: '#f2f3f6'}}
          />
        </div>
        <div style={{height: "85%"}}>
          <CommitsTimelineRollupBarChart
            model={model}
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
        <Flex pl={1} pt={2} pb={2} pr={10} align='center' justify={showSlider? 'left' : 'center'} style={{height: "5%"}}>
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
      view === 'detail' ?
        this.getDetailLayout(this.state.model, showHeader)
        : this.getPrimaryLayout('95%', this.state.model, showHeader)
    )

  }

}