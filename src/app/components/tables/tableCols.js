import React from "react";
import {readLocalStorage} from "../../helpers/hooksUtil";
import {MultiCheckboxFilter} from "../../dashboards/shared/widgets/work_items/wip/cycleTimeLatency/agGridUtils";
import {
  CustomComponentCol,
  CustomTypeCol,
  SORTER,
  TagsCol,
  TextWithStyle,
  parseTags,
  TextWithUom
} from "./tableUtils";
import { CardCol, StateTypeCol } from "../../dashboards/projects/shared/helper/renderers";
export const HIDDEN_COLUMNS_KEY = "all_tables_hidden_columns";
const MenuTabs = ["filterMenuTab", "generalMenuTab"];

/**
 * get optional cols with given colIds
 * @param {{colIds: string[]}} obj
 * @returns
 */
export function useOptionalColumnsForWorkItems({filters, workTrackingIntegrationType}) {
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
    }),
    [hasDisplayId]
  );

  const hasEpicName = hidden_cols.includes("epicName");
  const col2 = React.useMemo(
    () => ({
      field: "epicName",
      headerName: "Epic",
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ["contains", "startsWith"],
        buttons: ["reset"],
        maxNumConditions: 1,
      },
      menuTabs: MenuTabs,
      hide: !hasEpicName,
    }),
    [hasEpicName]
  );

  const hasWorkItemsSourceName = hidden_cols.includes("workItemsSourceName");
  const col3 = React.useMemo(
    () => ({
      headerName: "Workstream",
      field: "workItemsSourceName",
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.workItemStreams.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => record.workItemsSourceName === value,
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(TextWithStyle),
      hide: !hasWorkItemsSourceName,
    }),
    [hasWorkItemsSourceName, filters]
  );

  const hasTeams = hidden_cols.includes("teams");
  const col4 = React.useMemo(
    () => ({
      field: "teams",
      headerName: "Teams",
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.teams.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          const _teams = record.teamNodeRefs.map((t) => t.teamName);
          return _teams.includes(value);
        },
      },
      menuTabs: MenuTabs,
      hide: !hasTeams,
    }),
    [hasTeams, filters]
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
      filter: MultiCheckboxFilter,
      filterValueGetter: (params) => {
        const field = params.column.getColDef().field;
        const fieldValue = params.data[field];
        const componentTags = parseTags(fieldValue).component.join(", ");
        return componentTags;
      },
      filterParams: {
        values: filters.componentTags.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          return parseTags(record.tags).component.includes(value);
        },
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(CustomComponentCol),
      autoHeight: true,
      wrapText: true,
      hide: !hasComponent,
    }),
    [hasComponent, filters]
  );

  const hasCustomType = hidden_cols.includes("custom_type");
  const col7 = React.useMemo(
    () => ({
      headerName: "Custom Type",
      field: "tags",
      colId: "custom_type",
      filter: MultiCheckboxFilter,
      filterValueGetter: (params) => {
        const field = params.column.getColDef().field;
        const fieldValue = params.data[field];
        const customTypeTags = parseTags(fieldValue).custom_type;
        return customTypeTags;
      },
      filterParams: {
        values: filters.customTypeTags.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          return parseTags(record.tags).custom_type.includes(value);
        },
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(CustomTypeCol),
      hide: !hasCustomType,
    }),
    [hasCustomType, filters]
  );

  const hasCustomTags = hidden_cols.includes("custom_tags");
  const col8 = React.useMemo(
    () => ({
      headerName: "Tags",
      field: "tags",
      colId: "custom_tags",
      filter: MultiCheckboxFilter,
      filterValueGetter: (params) => {
        const field = params.column.getColDef().field;
        const fieldValue = params.data[field];
        const tags = parseTags(fieldValue).tags;
        return tags;
      },
      filterParams: {
        values: filters.tags.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          return parseTags(record.tags).tags.includes(value);
        },
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(TagsCol),
      hide: !hasCustomTags,
    }),
    [hasCustomTags, filters]
  );

  const hasStoryPoints = hidden_cols.includes("storyPoints");
  const col9 = React.useMemo(
    () => ({
      field: "storyPoints",
      headerName: "Story Points",
      cellRenderer: React.memo(TextWithStyle),
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
      cellRenderer: React.memo(TextWithStyle),
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

  const optionalCustomCols = workTrackingIntegrationType === "jira" ? [col6, col7, col8] : [];

  return [col1, col2, col3, col4, col5, col9, col10, col11, ...optionalCustomCols];
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
    menuTabs: [...MenuTabs, "columnsMenuTab"],
  };
}

export function getStateCol({filters}) {
  return {
    field: "state",
    headerName: "State",
    autoHeight: true,
    width: 250,
    cellRenderer: React.memo(StateTypeCol),
    comparator: (valA, valB, a, b) => SORTER.date_compare(a.data.latestTransitionDate, b.data.latestTransitionDate),
    filter: MultiCheckboxFilter,
    filterParams: {
      values: filters.states.map((b) => ({text: b, value: b})),
      onFilter: ({value, record}) => record.state.indexOf(value) === 0,
    },
    menuTabs: MenuTabs,
  };
}