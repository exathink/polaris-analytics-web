import React, {useState} from "react";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";
import {getMetricsMetaKey, getSelectedMetricColor, getSelectedMetricDisplayName} from "../../../helpers/metricsMeta";
import {VizItem, VizRow} from "../../../containers/layout";
import { AppTerms, WorkItemStateTypeColor, WorkItemStateTypeSortOrder, itemsAllDesc, itemsDesc, itemDesc } from "../../../config";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {Flex} from "reflexbox";
import "./valueStreamPhaseDetail.css";
import {getUniqItems} from "../../../../../helpers/utility";
import {Alert} from "antd";
import {WorkItemScopeSelector} from "../../../components/workItemScopeSelector/workItemScopeSelector";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import {getWorkItemDurations} from "../clientSideFlowMetrics";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";
import {getHistogramSeries, isClosed} from "../../../../projects/shared/helper/utils";
import {injectIntl} from "react-intl";
import {WorkItemsDetailHistogramTable} from "../workItemsDetailHistogramTable";
import {useCustomPhaseMapping} from "../../../../projects/projectDashboard";
import { ValueStreamDistributionChart } from "./valueStreamDistributionChart";
import { WorkItemsDetailHistogramChart } from "../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import { COL_TYPES } from "../../../../../components/tables/tableCols";
import { SORTER } from "../../../../../components/tables/tableUtils";


const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];


const PhaseDetailView = ({
  data,
  dimension,
  targetMetrics,
  workItemScope,
  setWorkItemScope,
  workItemScopeVisible = true,
  defaultToHistogram = true,
  view,
  context,
  intl,
}) => {
  const WorkItemStateTypeDisplayName = useCustomPhaseMapping();
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const uniqWorkItemsSources = React.useMemo(
    () => getUniqItems(workItems, (item) => item.workItemsSourceKey),
    [workItems]
  );

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const [selectedFilter, setFilter] = React.useState(null);
  const [selectedMetric, setSelectedMetric] = React.useState(null);

  /* Index the candidates by state type. These will be used to populate each tab */
  const workItemsByStateType = React.useMemo(
    () =>
      workItems.reduce((workItemsByStateType, workItem) => {
        if (workItemsByStateType[workItem.stateType] != null) {
          workItemsByStateType[workItem.stateType].push(workItem);
        } else {
          workItemsByStateType[workItem.stateType] = [workItem];
        }
        return workItemsByStateType;
      }, {}),
    [workItems]
  );
  const stateTypes = Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  );

  const [selectedStateType, setSelectedStateType] = useState(
    /* priority order to select the default open tab when we first render this component */
    ["closed", "wip", "complete", "open", "backlog"].find(
      (stateType) => workItemsByStateType[stateType] && workItemsByStateType[stateType].length > 0
    ) || stateTypes[0]
  );

  const defaultSelectedGrouping = defaultToHistogram ? "responseTime" : "table";
  const [selectedGrouping, setSelectedGrouping] = useState(defaultSelectedGrouping);

  const [colState, setColState] = React.useState({
    colData: workItemsByStateType[selectedStateType]?.map((x) => x["state"])??[],
    colId: "state",
    headerName: "State",
  });

  const candidateWorkItems = React.useMemo(() => {
    if (selectedStateType != null && workItemsByStateType[selectedStateType] != null) {
      return workItemsByStateType[selectedStateType]
    } else {
      return [];
    }
  }, [selectedStateType, workItemsByStateType]);

  const [resetComponentStateKey] = useResetComponentState();

  React.useEffect(() => {
    if (selectedFilter === null) {
      setSelectedGrouping(defaultSelectedGrouping);
    }
  }, [selectedFilter, defaultSelectedGrouping]);

  function resetFilterAndMetric() {
    // clear bucket and clear series
    setFilter(null);
    setSelectedMetric(null);
  }



  const workItemsWithAggregateDurations = React.useMemo(() => getWorkItemDurations(candidateWorkItems), [candidateWorkItems]);
  const specsOnly = workItemScope === "specs";

  function getChartTitle() {
    return
  }

  function getChartSubTitle() {

    return `${workItemsWithAggregateDurations.length} ${itemsDesc(specsOnly)}`;
  }

  React.useEffect(() => {
    setColState(prev => {
      return {
        ...prev,
        colData: workItemsWithAggregateDurations
          .map((x) => x[getMetricsMetaKey(prev.colId, selectedStateType)])
          .sort(COL_TYPES[prev.colId].sorter ?? SORTER.no_sort),
      };
    })

  }, [selectedStateType]);


  const seriesData = React.useMemo(() => {
    const specsOnly = workItemScope === "specs";

    const pointsLeadTimeOrAge = workItemsWithAggregateDurations.map((w) =>
      isClosed(selectedStateType) ? w["leadTime"] : w["cycleTime"]
    );
    const pointsCycleTimeOrLatency = workItemsWithAggregateDurations.map((w) =>
      isClosed(selectedStateType) ? w["cycleTime"] : w["latency"]
    );
    const pointsEffort = workItemsWithAggregateDurations.map((w) => w["effort"]);

    const seriesLeadTimeOrAge = getHistogramSeries({
      id: "leadTimeOrAge",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pointsLeadTimeOrAge,
      name: getSelectedMetricDisplayName("leadTimeOrAge", selectedStateType),
      color: getSelectedMetricColor("leadTimeOrAge", selectedStateType),
      visible: (isClosed(selectedStateType) && specsOnly === false) || !isClosed(selectedStateType),
    });
    const seriesCycleTimeOrLatency = getHistogramSeries({
      id: "cycleTimeOrLatency",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pointsCycleTimeOrLatency,
      name: getSelectedMetricDisplayName("cycleTimeOrLatency", selectedStateType),
      color: getSelectedMetricColor("cycleTimeOrLatency", selectedStateType),
      visible: isClosed(selectedStateType) && specsOnly === true,
    });
    const seriesEffort = getHistogramSeries({
      id: "effort",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pointsEffort,
      name: getSelectedMetricDisplayName("effort", selectedStateType),
      color: getSelectedMetricColor("effort", selectedStateType),
      visible: false,
    });

    return [seriesLeadTimeOrAge, seriesCycleTimeOrLatency, seriesEffort];
  }, [workItemScope, intl, selectedStateType, workItemsWithAggregateDurations]);

  if (selectedStateType != null) {
    const specsOnly = workItemScope === "specs";

    const continousValueseries = getHistogramSeries({
      id: colState.colId,
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: colState.colData,
      name: getSelectedMetricDisplayName(colState.colId, selectedStateType),
      color: getSelectedMetricColor(colState.colId, selectedStateType),
      visible: true,
    });

    let chartElement;
    if (COL_TYPES[colState.colId].type === "continous") {
      chartElement = (
        <WorkItemsDetailHistogramChart
          chartConfig={{
            title: `${WorkItemStateTypeDisplayName[selectedStateType]} Phase, ${colState.headerName} Distribution`,
            subtitle: getChartSubTitle(),
            legendItemClick: () => {}
        }}
          selectedMetric={getMetricsMetaKey(colState.colId, selectedStateType)}
          specsOnly={specsOnly}
          colWidthBoundaries={COL_WIDTH_BOUNDARIES}
          stateType={selectedStateType}
          series={[continousValueseries]}
        />
      );
    } else if(COL_TYPES[colState.colId].type === "category"){
      chartElement = (
        <ValueStreamDistributionChart
          colData={colState.colData.map((x) => (x == null ? "Unassigned" : x))}
          colId={colState.colId}
          headerName={colState.headerName}
          title={`${WorkItemStateTypeDisplayName[selectedStateType]} Phase, ${itemsDesc(specsOnly)} by ${colState.headerName} `}
          subtitle={`${getChartSubTitle()}`}
          specsOnly={specsOnly}
          histogramSeries={continousValueseries}
          stateType={selectedStateType}
        />
      );
    }

    return (
      <VizRow h={1}>
        <VizItem w={1} style={{height: "98%"}}>
          <div className="tw-h-[45%]">{chartElement}</div>
          <div className={"workItemStateDetailsControlWrapper"}>
            <div className={"middleControls"}>
              <GroupingSelector
                label={`Phase: ${WorkItemStateTypeDisplayName[selectedStateType]}`}
                groupings={stateTypes.map((stateType) => ({
                  key: stateType,
                  display: WorkItemStateTypeDisplayName[stateType],
                  style: {
                    backgroundColor: WorkItemStateTypeColor[stateType],
                    color: "#ffffff",
                  },
                }))}
                initialValue={selectedStateType}
                onGroupingChanged={(stateType) => {
                  setSelectedStateType(stateType);
                  resetFilterAndMetric();
                }}
                layout="col"
                className="tw-ml-4"
              />
            </div>
            <div className={"rightControls"}>
              <div className="workItemScopeSelector">
                {workItemScopeVisible && (
                  <WorkItemScopeSelector
                    className={"specsAllSelector"}
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                    layout="col"
                  />
                )}
              </div>

            </div>
          </div>
          <div className="tw-h-[50%]">
            <WorkItemsDetailHistogramTable
              // common props
              key={resetComponentStateKey}
              stateType={selectedStateType}
              tabSelection={'table'}
              colWidthBoundaries={COL_WIDTH_BOUNDARIES}
              // chart props
              chartSubTitle={getChartSubTitle()}
              specsOnly={workItemScope === "specs"}
              series={seriesData}
              onPointClick={({category, selectedMetric}) => {
                setSelectedMetric(selectedMetric);
                setFilter(category);
                setSelectedGrouping("table");
              }}
              clearFilters={resetFilterAndMetric}
              // table props
              view={view}
              selectedFilter={selectedFilter}
              tableData={workItemsWithAggregateDurations}
              tableSelectedMetric={selectedMetric}
              setShowPanel={setShowPanel}
              setWorkItemKey={setWorkItemKey}
              onSortChanged={(params) => {
                const sortState = params.columnApi.getColumnState().find((x) => x.sort);
                const supportedCols = Object.keys(COL_TYPES);
                const colId = sortState?.colId;
                if (sortState?.sort && supportedCols.includes(colId)) {
                  let filteredColVals = [];
                  params.api.forEachNodeAfterFilter((node) => {
                    if (!node.group) {
                      filteredColVals.push(node.data[colId]);
                    }
                  });
                  const columnDefs = params.columnApi.columnModel.columnDefs;
                  const headerName = columnDefs.find((x) => x.field === colId).headerName;
                  setColState({
                    colData: filteredColVals.sort(COL_TYPES[colId].sorter ?? SORTER.no_sort),
                    colId: colId,
                    headerName,
                  });
                }
              }}
            />
          </div>
        </VizItem>
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          context={context}
        />
      </VizRow>
    );
  } else {
    return (
      uniqWorkItemsSources.length === 0 && (
        <VizRow h={1}>
          <VizItem w={1}>
            <Flex w={0.95} justify="space-between">
              <Alert
                message="There are no work streams in this value stream"
                type="warning"
                showIcon
                closable
                className="noWorkItemResources"
              />
            </Flex>
          </VizItem>
        </VizRow>
      )
    );
  }
};
export const ValueStreamPhaseDetailView = withNavigationContext(injectIntl(PhaseDetailView));
