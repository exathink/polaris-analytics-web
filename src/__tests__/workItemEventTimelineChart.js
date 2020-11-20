/**
 * ## Points to consider
    1. create a generic function for rendering chart component
      - for rendering chart we need to render all the providers to get the full context
    2. rendering correctly (render component) => assert
    3. interacting correctly (state before) => interaction (state after)
    4. expect the output of getConfig function
    5. free from implementation details
 *
 */
import React from "react";
import {render} from "@testing-library/react";

import {WorkItemEventsTimelineChart} from "../app/dashboards/work_items/activity/eventTimeline/workItemEventTimelineChart";
import {withNavigationContext} from "../app/framework/navigation/components/withNavigationContext";
import PolarisFlowApp from "../polarisFlow";
const testData = require("./testData.json");

function renderChart() {
  const ChartComponent = withNavigationContext(WorkItemEventsTimelineChart);
  // Currently PolarisFlowApp doesn't allow children prop, so need to check some other method to render
  const utils = render(
    <PolarisFlowApp>
      <ChartComponent {...testData} />
    </PolarisFlowApp>
  );
  return utils;
}

// Tests
test("renders correct axis information", () => {
  const {debug} = renderChart();
  debug();
});

test("render minimum one and maximum two points on chart for every pull request", () => {});

test("when pullrequest point is clicked, it redirects to the actual pull request page", () => {});

test("tooltip is rendered on hover of pull request point with correct details", () => {});
