import {Chart, Highcharts, tooltipHtml} from "../../../../framework/viz/charts";
import {buildIndex, pick, localNow, capitalizeFirstLetter} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import WorkItems from "../../../work_items/context";
import {Colors} from "../../config";

require("highcharts/modules/treemap")(Highcharts);

const UNCATEGORIZED = {key: "uncategorized", displayValue: "Unplanned Work", color: "#a2c0de"};
const EFFORT_LIMIT = 0.5;
const TEXT_LIMIT = 37;
const colors = ['#2f7ed8', '#732855', '#8bbc21', '#964b4b', '#1aadce',
        '#926dbf', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']

function getEpicPointValue(epicWorkItems, specsOnly) {
  return specsOnly
    ? epicWorkItems.reduce((totalEffort, workItem) => totalEffort + workItem.effort, 0)
    : epicWorkItems.length;
}

function getHierarchySeries(workItems, specsOnly, intl) {
  const nonEpicWorkItems = workItems.filter((x) => x.workItemType !== "epic");
  const workItemsByEpic = buildIndex(nonEpicWorkItems, (workItem) => workItem.epicKey || UNCATEGORIZED.key);
  const nonEpicWorkItemPoints = nonEpicWorkItems.map((w) => {
      return {
        name: w.name,
        value: specsOnly ? w.effort : 1,
        effortValue: w.effort,
        parent: w.epicKey || UNCATEGORIZED.key,
        epicData: {
          epicName: w.epicName || UNCATEGORIZED.displayValue,
          epicVal: getEpicPointValue(workItemsByEpic[w.epicKey || UNCATEGORIZED.key], specsOnly)
        },
        workItem: w,
      };
    });


  return [
    {
      type: "treemap",
      layoutAlgorithm: "stripes",
      alternateStartingDirection: true,
      allowPointSelect: true,
      levels: [
        {
          level: 1,
          layoutAlgorithm: "squarified",
          dataLabels: {
            enabled: true,
            align: "center",
            verticalAlign: "top",
            style: {
              fontSize: "14px",
              fontWeight: "bold",
            },
            formatter: function () {
              return "";
            },
          },
        },
        {
          level: 2,
          dataLabels: {
            enabled: true,
            align: "right",
            verticalAlign: "bottom",
            allowOverlap: true,
            style: {
              fontSize: "10px",
            },
            formatter: function () {
              if (this.point.value < EFFORT_LIMIT) {
                return "";
              }
              const text = this.point.name.slice(0, TEXT_LIMIT);
              const ending = this.point.name.length > TEXT_LIMIT ? "..." : "";
              return text + ending;
            },
          },
        },
      ],
      data: Object.keys(workItemsByEpic)
        .map((epicKey, i) => {
          const epicName =
            epicKey === UNCATEGORIZED.key ? UNCATEGORIZED.displayValue : workItemsByEpic[epicKey][0].epicName;

          return {
          id: epicKey,
          name: epicName,
          value: getEpicPointValue(workItemsByEpic[epicKey], specsOnly),
          effortValue: workItemsByEpic[epicKey].reduce((totalEffort, workItem) => totalEffort + workItem.effort, 0),
          epic: {
            name: epicName,
            key: epicKey,
          },
          color: epicKey === UNCATEGORIZED.key ? UNCATEGORIZED.color : colors[i % colors.length-1],
          workItems: workItemsByEpic[epicKey],
        }
      }).concat(nonEpicWorkItemPoints),
      dataLabels: {
        enabled: true,
        useHTML: true,
      },
    },
  ];
}

function getSeries(workItems, specsOnly, intl, view) {
  const nonEpicWorkItems = workItems.filter((x) => x.workItemType !== "epic");

  const workItemsByEpic = buildIndex(nonEpicWorkItems, (workItem) => workItem.epicKey || UNCATEGORIZED.key);
  const effortOut = workItems.reduce((effortOut, workItem) => effortOut + workItem.effort, 0)
  return [
    {
      type: "treemap",
      layoutAlgorithm: "squarified",
      name: "Closed",
      allowPointSelect: true,
      //color: '#ddd6e2',

      data: Object.keys(workItemsByEpic).map((epicKey, i) => {
        const epicName =
          epicKey === UNCATEGORIZED.key ? UNCATEGORIZED.displayValue : workItemsByEpic[epicKey][0].epicName;

        return {
        name: epicName,
        value: getEpicPointValue(workItemsByEpic[epicKey], specsOnly),
        effortValue: workItemsByEpic[epicKey].reduce((totalEffort, workItem) => totalEffort + workItem.effort, 0),
        effortOut: effortOut,
        epic: {
          name: epicName,
          key: epicKey,
        },
        color: epicKey === UNCATEGORIZED.key ? UNCATEGORIZED.color : colors[i % colors.length-1],
        workItems: workItemsByEpic[epicKey],
      }}),
      dataLabels: {
        enabled: true,
        useHTML: true,

        formatter: function () {
          const {value, effortOut, workItems} = this.point;
          const dataLabelTitle = specsOnly ? (value/effortOut) * 100 : workItems.length;
          return `<div style="text-align: center;">${this.point.name}<br/>${intl.formatNumber(dataLabelTitle, {
            maximumSignificantDigits: 2,
          } )} ${specsOnly ? `%` : `Work Items`}</div>`;
        },
      },
    },
  ];
}

export const WorkItemsEpicEffortChart = Chart({
  // Update this function to choose which props will cause the chart config to be regenerated.
  chartUpdateProps: (props) => pick(props, "workItems", "specsOnly", "activeOnly", "days", "title", "subtitle"),

  // Leave this as is unless you want to create a different selection handler than the default one.
  eventHandler: DefaultSelectionEventHandler,

  // when the default selection handler calls its application callback, it calls this
  // mapper to map point objects into domain objects for the application. Attach domain objects to the series data
  // points and map them back here.
  mapPoints: (points, _) => points.map((point) => point.workItems),

  // These are the minimal props passed by the Chart component. Add
  // all the additional domain props you will pass to React component here so that
  // you can use them in building the config.
  getConfig: ({workItems, specsOnly, activeOnly, days, title, subtitle, intl, view, showHierarchy, context, setChartPoints}) => {
    let series = [];
    if (showHierarchy) {
      series = getHierarchySeries(workItems, specsOnly, intl);
    } else {
      series = getSeries(workItems, specsOnly, intl, view);
    }

    return {
      chart: {
        // some default options we include on all charts, but might want to
        // specialize in some cases.
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: title || (specsOnly ?
          `Capacity Investments by Epic: ${activeOnly ? "Work In Process" : ""}${days ? `Last ${days} days` : ""}`
        : `Card Volume by Epic: ${activeOnly ? "Work In Process" : ""}${days ? `Last ${days} days` : ""}`),
        align: "left",
      },
      subtitle: {
        text: `${specsOnly ? "% Capacity " : "% Volume "} by Epic: ${localNow(intl)}`,
        align: "left",
      },
      xAxis: {
        type: "linear",

        title: {
          text: "X",
        },
      },
      yAxis: {
        type: "linear",

        title: {
          text: "x",
        },
      },

      tooltip: {
        useHTML: true,
        outside: false,
        hideDelay: 50,
        formatter: function () {
          const {name, effortValue, workItems, epicData, workItem, parent} = this.point;
          if (showHierarchy) {
            if (parent == null) {
              return false;
            }

            let epicTitle = "";
            if (epicData) {
              const {epicName, epicVal} = epicData;
              if (specsOnly) {
                epicTitle = `Epic: ${epicName} (${intl.formatNumber(epicVal)} FTE Days)`;
              } else {
                epicTitle = `Epic: ${epicName} (${intl.formatNumber(epicVal)} Work Items)`;
              }
            }
            const workItemTitle = workItem ?[[capitalizeFirstLetter(workItem.workItemType), name]] : [];
            return tooltipHtml({
              header: `${epicTitle}`,
              body: [...workItemTitle, [`Effort`, `${intl.formatNumber(effortValue)} FTE Days`]],
            });
          }
          return tooltipHtml({
            header: `${name}`,
            body: [
              [`Effort`, `${intl.formatNumber(effortValue)} FTE Days`],
              [`Work Items`, `${workItems.length}`],
            ],
          });
        },
      },
      series: [...series],
      plotOptions: {
        series: {
          animation: false,
          cursor: 'pointer',
          events: {
            click: function (event) {
              if (showHierarchy) {
                const {workItem} = event.point;
                if (event.point.node.childrenTotal === 0 && workItem != null) {
                  context.navigate(WorkItems, workItem.displayId, workItem.workItemKey);
                }
              } else {
                if (setChartPoints) {
                  const {workItems, epic} = event.point;
                  // split the key by colon if key belongs to deliveryCycles, to get workItemKey
                  const workItemKeys = workItems.map(x => x.key.split(":")[0]).concat(epic.key);
                  setChartPoints(workItemKeys);
                }
              }
            },
          },
        },
        treemap: {},
        legend: {
          title: {
            text: "Legend",
            style: {
              fontStyle: "italic",
            },
          },
          align: "right",
          layout: "vertical",
          verticalAlign: "middle",
          itemMarginBottom: 3,
          enabled: false,
        },
      },
    };
  },
});
