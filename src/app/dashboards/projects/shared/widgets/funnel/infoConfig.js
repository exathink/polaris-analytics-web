import React from "react";

import {InfoCard} from "../../../../../components/misc/info";

const {Section, SubSection} = InfoCard;

export function PipelineFunnelWidgetInfoSummary() {
  return (
    <>
      <Section>
        <p>
          The funnel shows the number of cards currently in the Define, Open, and Deliver phases of your delivery
          process. In addition, for the Closed phase, it shows the number of completed <em>delivery cycles</em> within
          the current <em>flow analysis period</em>.
        </p>
        <p>
          <em>Note: This assumes your have configured your Delivery Process Mapping in Polaris.</em>
        </p>
      </Section>
    </>
  );
}

export function PipelineFunnelWidgetInfoDetail() {
  return (
    <>
      <PipelineFunnelWidgetInfoSummary />

      <p>
        A card may appear in the counts of more than one phase at a given point in time, if it was delivered multiple
        times during the flow analysis period. A delivery cycle is completed every time a card transitions to the Closed
        phase and a new one starts when the card transitions out of the Closed phase to one of the other active phases.
      </p>

      <SubSection heading={"Unmapped Cards"}>
        <p>
          Cards whose current workflow state is unmapped will show up at the top of the funnel. Time spent in unmapped
          states is not counted in the response time metrics.
        </p>
        <p>
          When you initially import a work stream its states are typically unmapped. Use the Delivery Process Mapping
          widget to map each workflow state to a Polaris phase. The funnel will update after your complete this step.
        </p>
      </SubSection>
      <Section heading={"Interpreting the Funnel"}>
        <p>The funnel gives you real time visibility into Phase level bottlenecks in your value stream.</p>
        <p>
          When work is flowing efficiently through the value stream, the sizes of the Define and Closed phase are
          relatively balanced and the total number of cards in the Open, Make and Deliver phases is typically less than
          the number of team members working on the cards. This indicates an appropriate level of work in progress and
          will also be reflected in other metrics like low <em>cycle time</em>.
        </p>
        <p>
          Significant imbalances the Open, Make or Deliver areas of the funnel indicate the work is queueing up in one
          or more of those phases. These will typically be reflected in the <em>age</em> and <em>latency</em> of work in progress.
          You can dig deeper using these diagnostic metrics starting from the Flow Dashboard.
        </p>
      </Section>
      <Section heading={"Lead Time and the Backlog"}>
        <p>The funnel can be very useful to maintain an optimally sized backlog at all times.</p>
        <p>
          The size of the Closed phase is proportional to the current pace of delivery, and Polaris shows this in real
          time as delivery cycles complete. You can use the relative sizes of the Closed and Define phase to understand
          how large an active Backlog you need to maintain in order to keep up with this pace of delivery. If you have a
          significantly larger number of items in the Define phase compared to the Closed phase, your have much more
          work queued up than you can reasonably deliver in the near term.
        </p>
        <SubSection heading={"Backlog Management"}>
          <p>
            The concept of delivery cycles in Polaris, gives you an easy way to prioritize your backlog: create a workflow state called ROADMAP and map this to the
            <em> Closed </em> phase in Polaris.
          </p>
          <ul>
            <li>
              If you think a given card will be not prioritized for delivery within a couple of flow analysis periods,
              move the card to the ROADMAP state and communicate this to your customer. This will reset your customer's
              expectations, and also close the delivery cycle and stop the lead and cycle time clocks for the card. You
              can move it back to your backlog state when it is closer to being worked on and the lead time
              clock will start ticking again. This way your lead time becomes a useful metric to measure how well you
              are doing against your customer commitments.
            </li>
            <li>
              If you dont think a card will be addressed in the next few periods, delete it or move it out of your work
              stream. It will come back again if the work is important enough to do.
            </li>
          </ul>
          <p>
            This way lead time time does not simply accumulate because a card was sitting in the backlog indefinitely.
            When this happens, it is hard to separate signal from noise in the lead time metric and it becomes much less
            useful.
          </p>
        </SubSection>
      </Section>
    </>
  );
}
