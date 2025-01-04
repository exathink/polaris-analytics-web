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
          visualize the end to end flow of work across the project in real time.
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
          value stream. If you have not yet set up a mapping, the funnel will show all cards as unmapped.
        </p>
        <ul>
          <li>
            For active phases: Define, Open, Make and Deliver, the chart shows the number of{" "}
            {<Glossary.CARDS/>} that are currently in the phase.
          </li>
          <li>
            For the Closed phase, it shows the number of { <Glossary.DELIVERY_CYCLES/>} that completed within
            the { <Glossary.FLOW_ANALYSIS_PERIOD append={"."}/>} This is also known as the delivery  <em> volume.</em>

          </li>
        </ul>
        <SubSection heading={"Delivery Cycles and Funnel Counts"}>
        <p>
          If a card has multiple completed delivery cycles times during the flow analysis period, it will be counted multiple times in the Closed
          phase. It may also simultaneously appear in the counts of one of the active phases if it is currently in an active phase.
          Technically, all counts shown in the funnel are counts of delivery cycles, not cards.
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
          balanced. In addition, the total number of cards in the Open, Make and Deliver phases will typically be less
          than the number of team members working on the cards. This indicates an appropriate level of work in progress
          in the delivery pipeline and should also be reflected in favorable outcomes like low {<Glossary.CYCLE_TIME/>} and
          high {<Glossary.VOLUME/>}
        </p>
        <p>
          Significant imbalances the sizes of the Open, Make or Deliver areas of the funnel indicate the work is
          queueing up in one or more of those phases. Cycle times will be high and throughput will be low. This will
          typically also be reflected in the <em>age</em> and <em>latency</em> of work in progress. You can dig deeper
          to diagnose the root cause using the Flow Dashboard.
        </p>
      </Section>
      <Section heading={"Lead Time and Backlog Optimization"}>
        <p>
          While internal queueing is reflected in the Open, Make and Delivery areas of the funnel, the relative sizes of
          the Define and Closed areas can be used to balance the size of the backlog with the pace of delivery. The size
          of the Closed phase is proportional to the current pace of delivery. If you have a significantly larger number
          of items in the Define phase compared to the Closed phase, your have much more work queued up than you can
          reasonably deliver in the near term, and its time prioritize and communicate your choices.
        </p>
        <SubSection>
          <p>
            For example, if your flow analysis period is 30 days and ratio of Define to Closed is 5:1, then you have
            roughly five months of work in the backlog based on the current pace of delivery. You can decide whether
            this is an appropriate size for you, but for fast moving Agile teams, we recommend something closer to a 2:1
            ratio of Define to Closed when sizing the backlog.
          </p>
        </SubSection>
        <Section heading={"Backlog Management"}>
          <p>
            The concept of delivery cycles in Polaris, gives you a simple and effective technique to continuously
            optimize the size of your active backlog and communicate your plans with your customer.
          </p>
          <SubSection>
            <ul>
              <li>
                Create a workflow state called ROADMAP in your work tracking system and map this to the
                <em> Closed </em> phase in Polaris.
              </li>
              <li>
                If you think a given card will be not prioritized for delivery within a couple of flow analysis periods,
                move the card to the ROADMAP state and communicate this to your customer. This will reset your
                customer's expectations. Polaris also closes the delivery cycle and stops the lead and cycle time clocks
                for the card. You can move it back to your backlog state when it is re-scheduled for delivery and the
                lead time clock will start ticking again. This way your lead time becomes a useful metric to measure how
                well you are doing against your customer commitments.
              </li>
              <li>
                If you dont think a card will be addressed in the next few analysis periods, delete it or move it out of
                your work stream. It will come back again if the work is important enough to do.
              </li>
            </ul>
          </SubSection>
          <p>
            By adopting this simple process, lead time time does not simply accumulate because a card was sitting in the
            backlog indefinitely. When that happens, it is hard to separate signal from noise in the lead time metric
            and it becomes much less useful. You will also have system for grooming your backlog that forces to you to
            prioritize and communicate your current plans with your customer and measure your performance against those
            promises.
          </p>
        </Section>
      </Section>
    </>
  );
}
