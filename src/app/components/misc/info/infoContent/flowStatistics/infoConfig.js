import React from "react";

import {Glossary, InfoCard} from "../../index";
import { PipelineFunnelWidgetInfoDetail, PipelineFunnelWidgetInfoSummary } from "../pipelineFunnelWidget/infoConfig";
import {
  FlowMixTrendsChart
} from "../../../../../dashboards/shared/widgets/work_items/trends/flowMix/flowMixTrendsChart";

const {Section, SubSection} = InfoCard;

export const StatsInfo = {}

StatsInfo.CycleTime = {
  title: "Average Cycle Time",
  headerContent: () =>  <CycleTimeInfoHeader/>,
  showDrawer: false,
  drawerContent: () => <CycleTimeInfoDetail/>,
}

export const CycleTimeInfoHeader = () => {
  return (
    <p>
      <Glossary.CYCLE_TIME inline={true}/>.
    </p>
  )
}
export const CycleTimeInfoDetail = () => {
  return (
  <>
    <CycleTimeInfoHeader/>
    <Section heading={"Definition"}>
      Cycle time is calculated by combining the data from work tracking and commit history for <Glossary.CARDS/>.
      The cumulative time spent in Open, Make and Deliver phases during  <Glossary.DELIVERY_CYCLES/> is defined as the <em>baseline cycle time</em>,
      for all cards. For <Glossary.SPECS/>, we also compute the total of <Glossary.CODING_TIME/> and <Glossary.DELIVERY_TIME/> in addition, and report
      the larger of the two values as the cycle time. This definition assumes that commit history is a more reliable source for specs, especially for those cases where
      the state of a card is not kept up to date by developers.
    </Section>
    <p/>
    <Section heading={"Why this matters"}>
      Cycle time is the key measurement that we use to improve overall delivery performance. If engineering capacity
      is a critical resource reducing cycle time is the main lever we have in order to reduce overall <Glossary.LEAD_TIME/>.
     <p/>
      Cycle time as defined above includes the time to make the code changes for a card, as well as the time for any downstream
      steps such as code reviews, merges, acceptance testing, build and deployment, manual or automated tests.
      <p/>
      Our definition is process agnostic, but for accurate results, it depends on the assumption that the <Glossary.DELIVERY_PROCESS_MAPPING/>
      defines the closed phase to include only those phases where a card has been delivered to customers. With this assumption,
      cycle time will capture all the overhead associated with manual QA, build and deployment processes if they are in place.
      It is important to not define cycle time in terms of any smaller interval such as sprints in a Scrum procress
      since it will not capture the true time it takes to deliver value to customers.
      <p/>
      Cycle time is broken down into <Glossary.CODING_TIME/> and <Glossary.DELIVERY_TIME/>. We also independently measure
      <Glossary.REVIEW_TIME/> as a component of cycle time, since pull requests are often a significant source of
      non-value added delays that lead to higher than desired cycle time. Each of these three components should be examined
      separately, and in relation to each other, to understand where the bottlenecks in a delivery process lie
      at any given point in time. These may shift over time, but typically the most critical system level constraints
      will typically show up here when you have sub-optimal process flow.
      <p/>

    </Section>

  </>
  )
}