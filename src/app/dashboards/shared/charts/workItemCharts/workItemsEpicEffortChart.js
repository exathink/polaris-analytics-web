import {Chart, Highcharts, tooltipHtml} from "../../../../framework/viz/charts";
import {buildIndex, pick, localNow} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import WorkItems from "../../../work_items/context";
import {Colors} from "../../config";

require("highcharts/modules/treemap")(Highcharts);

const UNCATEGORIZED = {key: "uncategorized", displayValue: "Uncategorized", color: "#a2c0de"};
const DEFAULT_EFFORT = 0.2;
const EFFORT_LIMIT = 0.5;
const TEXT_LIMIT = 37;
const colors = ['#2f7ed8', '#286673', '#8bbc21', '#964b4b', '#1aadce',
        '#926dbf', '#f28f43', '#77a1e5', '#c42525', '#a6c96a']

function getHierarchySeries(workItems, specsOnly, intl) {
  const workItemPoints = workItems.map((w) => {
    return {
      name: w.name,
      value: w.effort || DEFAULT_EFFORT,
      parent: w.epicKey || UNCATEGORIZED.key,
      workItem: w,
    };
  });

  const workItemsByEpic = buildIndex(workItems, (workItem) => workItem.epicKey || UNCATEGORIZED.key);

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
              const {value, workItems} = this.point;
              const dataLabelTitle = specsOnly ? value : workItems.length;
              return `<div style="text-align: center;">${this.point.name}<br/>${intl.formatNumber(dataLabelTitle, {
                maximumSignificantDigits: 2,
              })} ${specsOnly ? `Dev-Days` : `Cards`}</div>`;
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
          let epicName;
          if (epicKey === UNCATEGORIZED.key) {
            epicName = UNCATEGORIZED.displayValue;
          } else {
            epicName = workItemsByEpic[epicKey][0].epicName
          }
          return {
          id: epicKey,
          name: epicName,
          value: workItemsByEpic[epicKey].reduce((totalEffort, workItem) => totalEffort + workItem.effort, 0),
          epic: {
            name: epicName,
            key: epicKey,
          },
          color: epicKey === UNCATEGORIZED.key ? UNCATEGORIZED.color : colors[i % colors.length-1],
          workItems: workItemsByEpic[epicKey],
        }
      }).concat(workItemPoints),
      dataLabels: {
        enabled: true,
        useHTML: true,
      },
    },
  ];
}

function getSeries(workItems, specsOnly, intl, view) {
  const workItemsByEpic = buildIndex(workItems, (workItem) => workItem.epicKey || UNCATEGORIZED.key);

  return [
    {
      type: "treemap",
      layoutAlgorithm: "squarified",
      name: "Closed",
      //color: '#ddd6e2',

      data: Object.keys(workItemsByEpic).map((epicKey) => {
        let epicName;
        if (epicKey === UNCATEGORIZED.key) {
          epicName = UNCATEGORIZED.displayValue;
        } else {
          epicName = workItemsByEpic[epicKey][0].epicName;
        }

        return {
        name: epicName,
        value: workItemsByEpic[epicKey].reduce((totalEffort, workItem) => totalEffort + workItem.effort, 0),
        epic: {
          name: epicName,
          key: epicKey,
        },
        workItems: workItemsByEpic[epicKey],
      }}),
      dataLabels: {
        enabled: true,
        useHTML: true,

        formatter: function () {
          const {value, workItems} = this.point;
          const dataLabelTitle = specsOnly ? value : workItems.length;
          return `<div style="text-align: center;">${this.point.name}<br/>${intl.formatNumber(dataLabelTitle, {
            maximumSignificantDigits: 2,
          })} ${specsOnly ? `Dev-Days` : `Cards`}</div>`;
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
  getConfig: ({workItems, specsOnly, activeOnly, days, title, subtitle, intl, view, showHierarchy, context}) => {
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
        text: title || `Value Book: ${activeOnly ? "Work In Progress" : ""}${days ? `Last ${days} days` : ""}`,
        align: "left",
      },
      subtitle: {
        text: `${specsOnly ? "% EffortOUT " : "% Volume "} by Epic: ${localNow(intl)}`,
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
          const {name, value, workItems, workItem, parent} = this.point;
          if (showHierarchy) {
            let effortVal = value;
            let cards = [];
            if (parent == null) {
              cards = [[`Cards`, `${workItems.length}`]];
            } else {
              effortVal = workItem.effort == null ? null : workItem.effort;
            }

            return tooltipHtml({
              header: `${name}`,
              body: [[`Effort`, `${intl.formatNumber(effortVal)} Dev-Days`], ...cards],
            });
          }
          return tooltipHtml({
            header: `${name}`,
            body: [
              [`Effort`, `${intl.formatNumber(value)} Dev-Days`],
              [`Cards`, `${workItems.length}`],
            ],
          });
        },
      },
      series: [...series],
      plotOptions: {
        series: {
          animation: false,
          events: {
            click: function (event) {
              if (showHierarchy) {
                const {workItem} = event.point;
                if (event.point.node.childrenTotal === 0 && workItem != null) {
                  context.navigate(WorkItems, workItem.displayId, workItem.workItemKey);
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
