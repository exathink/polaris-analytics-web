import React from "react";

import {Glossary, InfoCard} from "../../index";

const {Section, SubSection} = InfoCard;

export const PipelineFunnelWidgetInfoConfig = {
  title: "The Funnel",
  headerContent: () => <PipelineFunnelWidgetInfoSummary />,
  showDrawer: true,
  drawerContent: () => <PipelineFunnelWidgetInfoDetail />,
};

export const PipelineFunnelWidgetInitialInfoConfig = {
  title: "The Funnel",
  headerContent: () => <PipelineFunnelWidgetInitialInfoSummary />,
  showDrawer: false,
};


export function PipelineFunnelWidgetInitialInfoSummary() {
  return (
    <>
      <Section>
        <p>
          Once you have set up the delivery process mapping on the right, the funnel will update and let you
          visualize the end to end flow of work across the value stream in real time.
        </p>
        <p>So head over to the Delivery Process Mapping widget first and set that up. </p>
      </Section>
    </>
  )
}
export function PipelineFunnelWidgetInfoSummary() {
  return (
    <>
      <Section>
        <p>
          The funnel helps you visualize and balance the end-to-end flow of work across a value stream in real time.
        </p>
        <h4>Key Functions</h4>
        <ul>
          <li>Quickly spot phase level queuing and system-wide constraints as they emerge.</li>
          <li>Maintain an optimally sized backlog that matches the actual pace of customer delivery.</li>
        </ul>
      </Section>
    </>
  );
}



export function PipelineFunnelWidgetInfoDetail() {
  return (
    <>
      <Section>
        <p>
          The funnel helps you visualize and balance the end-to-end flow of work across a value stream in real time.
        </p>
      </Section>
      <Section heading={"Interpretation"}>
        <p>
          Each region in the funnel represents a {<Glossary.PHASE/>} in the {<Glossary.DELIVERY_PROCESS_MAPPING/>} for the
          value stream. If you have not yet set up a mapping, the funnel will show all work item
s as unmapped.
        </p>
        <ul>
          <li>
            For active phases: Define, Open, Code and Ship, the chart shows the number of{" "}
            {<Glossary.CARDS
S/>} that are currently in the phase.
          </li>
          <li>
            For the Closed phase, it shows the number of { <Glossary.DELIVERY_CYCLES/>} that completed within
            the { <Glossary.FLOW_ANALYSIS_PERIOD append={"."}/>} This is also known as the <em>Flow Velocity</em>.

          </li>
        </ul>
        <SubSection heading={"Delivery Cycles and Funnel Counts"}>
        <p>
          If a work item

 has multiple completed delivery cycles times during the flow analysis period, it will be counted multiple times in the Closed
          phase. It may also simultaneously appear in the counts of one of the active phases if it is currently in an active phase.
          Technically, all counts shown in the funnel are counts of delivery cycles, not work items.
        </p>
      </SubSection>
      </Section>
      <br />

      <h2>Use Cases</h2>

      <Section heading={"Visualizing Phase Level Bottlenecks"}>
        <p>
          The relative sizes of the regions of the funnel can be used to visualize phase level queueing, and to balance
          end to end flow of work.
        </p>
        <p>
          When work is flowing efficiently through the value stream, the sizes of the Define and Closed phase will be
          balanced. In addition, the total number of work item

s in the Open, Code and Ship phases will typically be less
          than the number of team members working on the work item

s. This indicates an appropriate level of work in progress
          in the delivery pipeline and should also be reflected in favorable outcomes like low {<Glossary.CYCLE_TIME/>} and
          high {<Glossary.THROUGHPUT/>}
        </p>
        <p>
          Significant imbalances the sizes of the Open, Code or Ship
areas of the funnel indicate the work is
          queueing up in one or more of those phases. Cycle times will be high and throughput will be low. This will
          typically also be reflected in the <em>age</em> and <em>latency</em> of work in progress. You can dig deeper
          to diagnose the root cause using the Work In Process (WIP) Dashboard.
        </p>
      </Section>
      <Section heading={"Flow Planning"}>
        <p>
          While internal queueing is reflected in the Open, Code and Ship areas of the funnel, the relative sizes of
          the Define and Closed areas can be used to balance the size of the backlog with the pace of delivery. The size
          of the Closed phase is proportional to the current pace of delivery. If you have a significantly larger number
          of items in the Define phase compared to the Closed phase, your have much more work queued up than you can
          reasonably ship in the near term, and its time prioritize and communicate your choices.
        </p>
        <SubSection heading={"Days Supply"}>
          <p>
            The days supply of work items in the Define phase, is computed by taking the current throughput (the rate at which the work is completing)
            and estimating the number of days it would take to work through the all the items in the Define, Open, Code and Ship phases at this rate.
            Note that this is not a forecast of when these items will complete: its only a way to size the backlog in terms of the current flow through the system.

          </p>
        </SubSection>
        <Section heading={"Backlog Management"}>
          <p>
            The notion of deferred states in the the phase mapping gives you a way to take the areas of the backlog that represent uncommitted work
            and hide it from the days supply calculation. Any work item in a deferred state is removed from the Define
            phase in the funnel, and also removed from the days supply calculation.
          </p>
          <p>
            If the flow analysis period is 30 days, we typically want to see about the same days suppy of non-deferred items in the Define phase of the funnel.
          </p>


        </Section>
      </Section>
    </>
  );
}
