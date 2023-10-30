import React from "react";
import {readLocalStorage} from "../../helpers/hooksUtil";
import {MultiCheckboxFilter} from "../../dashboards/shared/widgets/work_items/wip/cycleTimeLatency/agGridUtils";
import {
  CustomComponentCol,
  CustomTypeCol,
  SORTER,
  TagsCol,
  TextWithStyle,
  TextWithUom,
  parseTags,
  ArrayCol
} from "./tableUtils";
import {CardCol, IssueTypeCol, StateTypeCol} from "../../dashboards/projects/shared/helper/renderers";
import {HIDDEN_COLUMNS_KEY} from "../../helpers/localStorageUtils";
import {EFFORT_CATEGORIES, doesPairWiseFilterPass} from "../../dashboards/shared/widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { useBlurClass } from "../../helpers/utility";

const MenuTabs = ["filterMenuTab", "generalMenuTab"];
export const BLANKS = "Blank";
/**
 * get optional cols with given colIds
 * @param {{colIds: string[]}} obj
 * @returns
 */
export function useOptionalColumnsForWorkItems({filters, workTrackingIntegrationType}) {
  const blurClass = useBlurClass();
  const hidden_cols = readLocalStorage(HIDDEN_COLUMNS_KEY, []);

  const hasDisplayId = hidden_cols.includes("displayId");
  const col1 = React.useMemo(
    () => ({
      field: "displayId",
      headerName: "ID",
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith"],
        buttons: ["reset"],
        maxNumConditions: 1,
      },
      menuTabs: MenuTabs,
      hide: !hasDisplayId,
      cellClass: blurClass
    }),
    [hasDisplayId, blurClass]
  );

  const hasEpicName = hidden_cols.includes("epicName");
  const col2 = React.useMemo(
    () => ({
      field: "epicName",
      headerName: "Epic",
      filter: "agSetColumnFilter",
      menuTabs: MenuTabs,
      hide: !hasEpicName,
      cellClass: blurClass,
    }),
    [hasEpicName, blurClass]
  );

  const hasWorkItemsSourceName = hidden_cols.includes("workItemsSourceName");
  const col3 = React.useMemo(
    () => ({
      headerName: "Workstream",
      field: "workItemsSourceName",
      filter: "agSetColumnFilter",
      menuTabs: MenuTabs,
      cellRenderer: React.memo(TextWithStyle),
      hide: !hasWorkItemsSourceName,
      cellClass: blurClass
    }),
    [hasWorkItemsSourceName, blurClass]
  );

  const hasTeams = hidden_cols.includes("teams");
  const col4 = React.useMemo(
    () => ({
      field: "teams",
      headerName: "Teams",
      filter: "agSetColumnFilter",
      valueGetter: (params) => {
        const fieldValue = params.data["teamNodeRefs"].map(t => t.teamName);
        return fieldValue;
      },
      menuTabs: MenuTabs,
      hide: !hasTeams,
    }),
    [hasTeams]
  );

  const hasUrl = hidden_cols.includes("url");
  const col5 = React.useMemo(
    () => ({
      field: "url",
      headerName: "URL",
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith"],
        buttons: ["reset"],
        maxNumConditions: 1,
      },
      menuTabs: MenuTabs,
      hide: !hasUrl,
      cellClass: "hyperlinks",
    }),
    [hasUrl]
  );

  const hasComponent = hidden_cols.includes("component");
  const col6 = React.useMemo(
    () => ({
      headerName: "Component",
      field: "tags",
      colId: "component",
      filter: "agSetColumnFilter",
      valueGetter: (params) => {
        const field = params.column.getColDef().field;
        const fieldValue = params.data[field];
        const tags = parseTags(fieldValue).component;
        return tags;
      },
      filterParams: {
        defaultToNothingSelected: true,
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(CustomComponentCol),
      autoHeight: true,
      wrapText: true,
      hide: !hasComponent,
    }),
    [hasComponent]
  );

  const hasCustomType = hidden_cols.includes("custom_type");
  const col7 = React.useMemo(
    () => ({
      headerName: "Custom Type",
      field: "tags",
      colId: "custom_type",
      filter: "agSetColumnFilter",
      valueGetter: (params) => {
        const field = params.column.getColDef().field;
        const fieldValue = params.data[field];
        const tags = parseTags(fieldValue).custom_type;
        return tags;
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(CustomTypeCol),
      hide: !hasCustomType,
    }),
    [hasCustomType]
  );

  const hasCustomTags = hidden_cols.includes("custom_tags");
  const col8 = React.useMemo(
    () => ({
      headerName: "Tags",
      field: "tags",
      colId: "custom_tags",
      filter: "agSetColumnFilter",
      valueGetter: (params) => {
        const field = params.column.getColDef().field;
        const fieldValue = params.data[field];
        const tags = parseTags(fieldValue).tags;
        return tags;
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(TagsCol),
      hide: !hasCustomTags,
    }),
    [hasCustomTags]
  );

  const hasStoryPoints = hidden_cols.includes("storyPoints");
  const col9 = React.useMemo(
    () => ({
      field: "storyPoints",
      headerName: "Story Points",
      cellRenderer: React.memo(TextWithStyle),
      filter: "agNumberColumnFilter",
      filterParams: {
        maxNumConditions: 1,
        filterOptions: ["inRange", "lessThanOrEqual", "greaterThanOrEqual"],
        buttons: ["reset"],
        inRangeInclusive: true
      },
      menuTabs: MenuTabs,
      hide: !hasStoryPoints,
      comparator: SORTER.number_compare,
    }),
    [hasStoryPoints]
  );

  const hasReleases = hidden_cols.includes("releases");
  const col10 = React.useMemo(
    () => ({
      field: "releases",
      headerName: "Releases",
      cellRenderer: React.memo(ArrayCol),
      filter: "agSetColumnFilter",
      menuTabs: MenuTabs,
      hide: !hasReleases,
    }),
    [hasReleases]
  );

  const hasPriority = hidden_cols.includes("priority");
  const col11 = React.useMemo(
    () => ({
      field: "priority",
      headerName: "Priority",
      cellRenderer: React.memo(TextWithStyle),
      filter: "agSetColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith"],
        buttons: ["reset"],
        maxNumConditions: 1,
      },
      menuTabs: MenuTabs,
      hide: !hasPriority,

    }),
    [hasPriority]
  );

  const hasSprints = hidden_cols.includes("sprints");
  const col12 = React.useMemo(
    () => ({
      field: "sprints",
      headerName: "Sprints",
      cellRenderer: React.memo(ArrayCol),
      filter: "agSetColumnFilter",
      menuTabs: MenuTabs,
      hide: !hasSprints,
    }),
    [hasSprints]
  );


  const optionalCustomCols = workTrackingIntegrationType === "jira" ? [col6, col7, col8] : [];

  return [col1, col2, col3, col4, col5, col9, col10, col11, col12, ...optionalCustomCols];
}

export function getWorkItemNameCol() {
  return {
    field: "name",
    headerName: "Work Item",
    width: 320,
    filter: "agTextColumnFilter",
    floatingFilter: false,
    filterParams: {
      filterOptions: ["contains", "startsWith"],
      buttons: ["reset"],
      maxNumConditions: 1,
    },
    filterValueGetter: (params) => {
      return `${params.getValue("name")} ${params.getValue("displayId")} ${params.getValue("epicName")}`;
    },
    pinned: "left",
    cellRenderer: React.memo(CardCol),
    autoHeight: true,
    comparator: (valA, valB, a, b) => SORTER.string_compare(a.data.displayId, b.data.displayId),
    menuTabs: ["columnsMenuTab", ...MenuTabs],
  };
}

function stateFormatter(params) {
  return String(params.value).toLowerCase();
}
export function getStateCol({filters}) {
  return {
    field: "state",
    headerName: "State",
    autoHeight: true,
    width: 250,
    cellRenderer: React.memo(StateTypeCol),
    comparator: (valA, valB, a, b) => {
      if (!a || !b) {
        return;        
      }
      return SORTER.date_compare(a.data.latestTransitionDate, b.data.latestTransitionDate)
    },
    filter: "agSetColumnFilter",
    filterParams: {
      valueFormatter: stateFormatter,
    },
    menuTabs: MenuTabs,

  };
}

export function getEffortCol() {
  const effortCategories = [BLANKS, ...EFFORT_CATEGORIES].map(x => ({text: x, value: x}));
  return {
    field: "effort",
    headerName: "Effort",
    cellRenderer: React.memo(TextWithUom),
    cellRendererParams: {
      uom: "FTE Days",
    },
    filter: MultiCheckboxFilter,
    filterParams: {
      values: effortCategories,
      onFilter: ({value, record}) => {
        return doesPairWiseFilterPass({value, record, metric: "effort"});
      },
    },
    menuTabs: MenuTabs,
    comparator: SORTER.number_compare,
  };
}

export function getWorkItemTypeCol() {
  return {
    headerName: "Work Item Type",
    field: "workItemType",
    cellRenderer: React.memo(IssueTypeCol),
    filter: "agSetColumnFilter",
    filterParams: {
      cellRenderer: IssueTypeCol,
    },
    menuTabs: MenuTabs,
    // comparator: SORTER.number_compare,
  };
}

export const COL_TYPES = {
  state: "category",
  workItemType: "category",
  workItemsSourceName: "category",
  priority: "category",
  
  cycleTime: "continous",
  cycleTimeOrLatency: "continous",
  leadTime: "continous",
  leadTimeOrAge: "continous",
  effort: "continous",
};