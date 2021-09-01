import {Button, InputNumber} from "antd";
import React from "react";
import {RangeSlider, TWO_MONTHS, THREE_MONTHS} from "../../../shared/components/daysRangeSlider/daysRangeSlider";
import {InfoWithDrawer} from "../../../shared/components/infoDrawer/infoDrawerUtils";
import {actionTypes} from "./constants";
import styles from "./projectAnalysisPeriods.module.css";

export function AnalysisPeriodsSliders({wipPeriod, flowPeriod, trendsPeriod, initialAnalysisPeriods, dispatch}) {
  let [wipDaysMarks, flowDaysMarks, trendsDaysMarks] = [TWO_MONTHS, TWO_MONTHS, THREE_MONTHS];

  // get min and max from range
  const [wipMin, wipMax] = [wipDaysMarks[0], wipDaysMarks[wipDaysMarks.length - 1]];
  const [flowMin, flowMax] = [flowDaysMarks[0], flowDaysMarks[flowDaysMarks.length - 1]];
  const [trendsMin, trendsMax] = [trendsDaysMarks[0], trendsDaysMarks[trendsDaysMarks.length - 1]];
  
  const [setWipRange, setFlowRange, setTrendsRange] = [
    (newPeriod) => dispatch({type: actionTypes.UPDATE_WIP_PERIOD, payload: Math.floor(newPeriod)}),
    (newPeriod) => dispatch({type: actionTypes.UPDATE_FLOW_PERIOD, payload: Math.floor(newPeriod)}),
    (newPeriod) => dispatch({type: actionTypes.UPDATE_TRENDS_PERIOD, payload: Math.floor(newPeriod)}),
  ];

  const analysisPeriodItems = [
    {
      id: "wipAnalysisPeriod",
      title: "Wip Analysis Window",
      period: wipPeriod,
      setPeriod: setWipRange,
      range: wipDaysMarks,
      min: wipMin,
      max: wipMax,
      className: wipPeriod !== initialAnalysisPeriods.wipAnalysisPeriod ? ` ${styles["analysis-slider-bar-edit"]}` : "",
      info: (
        <>
          <p>The analysis period to benchmark cycle time for work items in progress against recently closed items.</p>{" "}
          <p>
            The cycle time SLA as well as metrics for closed items in the Wip dashboard use this period by default.{" "}
          </p>{" "}
          <p>
            This value should be atleast as large as the cycle time SLA value. The value selected here becomes the
            default Wip analysis period for this value stream for all users.
          </p>
        </>
      ),
      dataTestId: "wip-range-input",
    },
    {
      id: "flowAnalysisPeriod",
      title: "Flow Analysis Window",
      period: flowPeriod,
      setPeriod: setFlowRange,
      range: flowDaysMarks,
      min: flowMin,
      max: flowMax,
      className:
        flowPeriod !== initialAnalysisPeriods.flowAnalysisPeriod ? ` ${styles["analysis-slider-bar-edit"]}` : "",
      info: (
        <>
          <p>The default analysis period to analyze flow metrics for value stream in Flow dashboard.</p>{" "}
          <p>This value must be larger than the Wip analysis window and typically is 2-4x the Wip analysis period. </p>{" "}
          <p>
            This value must be larger than the flow analysis window and typically is 1.5-4x the Wip analysis period. The
            value selected here becomes the default analysis period for the Flow dashboard for all users.
          </p>
        </>
      ),
      dataTestId: "flow-range-input",
    },
    {
      id: "trendsAnalysisPeriod",
      title: "Trends Analysis Window",
      period: trendsPeriod,
      setPeriod: setTrendsRange,
      range: trendsDaysMarks,
      min: trendsMin,
      max: trendsMax,
      className:
        trendsPeriod !== initialAnalysisPeriods.trendsAnalysisPeriod ? ` ${styles["analysis-slider-bar-edit"]}` : "",
      info: (
        <>
          <p>
            The default analysis period for showing longer term trends for the Value Stream in the trends dashboard.{" "}
          </p>
          <p>
            This value must be larger than the flow analysis window and typically is 1.5-4x the Wip analysis period.
          </p>{" "}
          <p>The value selected here becomes the default analysis period for the Trends dashboard for all users. </p>
        </>
      ),
      dataTestId: "trends-range-input",
    },
  ];

  const [showPanel, setShowPanel] = React.useState(false);
  function getInfoDrawer() {
    return (
      <div className={styles.infoDrawer} id="analysis-periods-info">
        <Button type="link" className={styles.showMeButton} onClick={() => setShowPanel(!showPanel)}>
          Show me how
        </Button>
        <InfoWithDrawer
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          height={250}
          drawerOptions={{getContainer: () => document.getElementById("analysis-periods-info")}}
        >
          <div className={styles.analysisInfoItems}>
            {analysisPeriodItems.map((item) => {
              return (
                <div className={styles.itemWrapper} key={item.id}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles["analysis-info"]}>{item.info}</div>
                </div>
              );
            })}
          </div>
        </InfoWithDrawer>
      </div>
    );
  }

  return (
    <div className={styles["analysisItemsWrapper"]}>
      {getInfoDrawer()}
      {analysisPeriodItems.map((item) => {
        return (
          <div key={item.id} className={styles["analysisItemWrapper"]}>
            <div className={`${styles["analysis-slider-bar"]} ${item.className}`}>
              <RangeSlider
                title={item.title}
                initialDays={item.period}
                setDaysRange={item.setPeriod}
                range={item.range}
                className={styles["analysisRangeSlider"]}
              />
              <InputNumber
                min={item.min}
                max={item.max}
                style={{margin: "0 16px"}}
                value={item.period}
                onChange={item.setPeriod}
                data-testid={item.dataTestId}
                type="number"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
