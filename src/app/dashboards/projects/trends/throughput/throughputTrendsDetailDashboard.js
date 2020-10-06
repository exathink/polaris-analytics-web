import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectThroughputTrendsWidget} from "./throughputTrendsWidget";
import {DaysRangeSlider, SIX_MONTHS} from "../../../shared/components/daysRangeSlider/daysRangeSlider";


const dashboard_id = 'dashboards.trends.projects.throughput.detail';


export const ProjectThroughputTrendsDetailDashboard = (
  {

    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    pollInterval
  }
) => {
  const [daysRange, setDaysRange] = useState(days);
  const [measurementWindowRange, setMeasurementWindowRange] = useState(measurementWindow);
  const [frequencyRange, setFrequencyRange] = useState(samplingFrequency);


  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={1}
        title={`Throughput Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={[
          () =>
            <div title="Days" style={{minWidth: "500px"}}>
              <DaysRangeSlider
                initialDays={daysRange}
                setDaysRange={setDaysRange}
                range={SIX_MONTHS}
              />
            </div>
              ,
          () =>
            <div title="Sampling Frequency" style={{minWidth: "200px"}}>
              <DaysRangeSlider
                title={'Frequency'}
                initialDays={frequencyRange}
                setDaysRange={setFrequencyRange}
                range={[1,7,14,30]}
              />
            </div>
              ,
          () =>
            <div title="Window" style={{minWidth: "200px"}}>
              <DaysRangeSlider
                title={'Window'}
                initialDays={measurementWindowRange}
                setDaysRange={setMeasurementWindowRange}
                range={[1,7,14,30]}
              />
            </div>
          ,

        ]}
      >
        <DashboardWidget
          w={1}
          name="cycle-metrics-summary-detailed"
          render={
            ({view}) =>
              <ProjectThroughputTrendsWidget
                instanceKey={instanceKey}

                view={view}

                latestWorkItemEvent={latestWorkItemEvent}
                days={daysRange}
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
                targetPercentile={targetPercentile}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}