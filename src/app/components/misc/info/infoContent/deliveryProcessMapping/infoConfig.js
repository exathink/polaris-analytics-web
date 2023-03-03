import React from "react";

import {InfoCard, PhaseDefinitions} from "../../index";

const {Section, SubSection} = InfoCard;

export const DeliveryProcessMappingInfoConfig = {
  title: "Delivery Process Mapping",
  headerContent: () => <DeliveryProcessMappingSummary />,
  showDrawer: true,
  drawerContent: () => <DeliveryProcessMappingDetails />,
  showDrawerTitle: false,
  drawerOptions: {
    width: "68vw",
  },
};

export const DeliveryProcessMappingInitialInfoConfig = {
  title: "Delivery Process Mapping",
  headerContent: () => <DeliveryProcessMappingInitialSummary />,
  showDrawer: true,
  drawerContent: () => <DeliveryProcessMappingDetails />,
  showDrawerTitle: false,
  drawerOptions: {
    width: "68vw",
  },
};

export function DeliveryProcessMappingInitialSummary() {
  return (
    <>
      <Section>
        <p>
          Polaris models a delivery process with a mapping of states in your workflow to one of five standard phases
          that represent key stages in the software development lifecycle.
        </p>
        <p>
          This is a pre-requisite for analyzing response time metrics for the value stream. It needs to be configured
          before Polaris can show you the analytics dashboards for the value stream.
        </p>
        <p>
          Click the button below for guidance on how to configure this mapping. You may update this mapping at any time
          after you set it up initially.
        </p>
      </Section>
    </>
  );
}

export function DeliveryProcessMappingSummary() {
  return (
    <>
      <Section>
        <p>
          Polaris models a delivery process with a mapping of states in your workflow to one of five standard phases
          that represent key stages in the software development lifecycle.
        </p>
        <h4>Key Functions</h4>
        Drag and drop model configuration to specify
        <ul>
          <li>The definition of done.</li>
          <li>The definition of Lead and Cycle Time.</li>
        </ul>
      </Section>
    </>
  );
}

export function DeliveryProcessMappingDetails() {
  return (
    <>
      <Section heading={"Mapping a Delivery Process"}>
        <p>
          Polaris models a delivery process with a mapping of states in your workflow to one of five standard phases
          that represent key stages in the software development lifecycle. There are four <em>work</em> phases:
          Define, Open, Code and Ship and one
          <em> terminal</em> phase: Closed.
        </p>
        <p>
          Measurements in the model are based on the concept of a <em>delivery cycle</em>.
        </p>
        <SubSection heading={"Delivery Cycles and Response Time"}>
          <ul>
            <li>
              A delivery cycle starts when a work item transitions to a state mapped to one of the work phases. It ends
              when it transitions to a state mapped to the terminal phase. When a work item is initially created, it starts
              in the Define phase.
            </li>
            <li>
              A work item may require one <em>or more</em> delivery cycles through your process before it reaches a customer.
            </li>
            <li>
              There are two key <em> Response Time </em> measurements that are defined on delivery cycles.
              <ul>
                <li>
                  <em>Lead Time</em> is defined as the <em>cumulative</em> time a work item spends in the work phases
                  during the cycle.
                </li>
                <li>
                  <em> Work Cycle Time</em> is defined as the <em>cumulative</em> time the work item spends in the Open, Make and
                  Deliver phases during the cycle. This is a <em>component</em> of development cycle time in Polaris.
                </li>
              </ul>
            </li>
          </ul>
          <p>
            Work in software often moves <em>backwards</em> through a delivery process, typically due to re-work or
            re-prioritization. Measuring lead and cycle time using cumulative time and independent phase clocks as opposed to
            measuring elapsed time based on transition start and end dates alone, allows us to correctly account for this.
          </p>
        </SubSection>

        <SubSection heading={"Phase Definitions and Mapping Guidelines"}>
          <PhaseDefinitions />
        </SubSection>
      </Section>

      <SubSection heading={"How to Map"} style={{marginTop: "30px"}}>
        <ul>
          <li>
            A value stream in Polaris consists of one or more work streams, each of which typically corresponds to a
            project or a board in your work tracking system.
          </li>
          <li>
            If you have multiple work streams, you need to provide a mapping for each one. A drop down appears on the
            top left of the chart to let you choose the work stream to map.
          </li>
          <li>
            To map, drag each state in the delivery workflow for the work stream into a standard phase using the above
            definitions. You must be an organization owner to configure this mapping, otherwise drag and drop is
            disabled.
          </li>
          <li>
            Time spent in unmapped states is not included in response time calculations, so you should map every all
            unmapped states even if you are not currently using some of them in your current workflow. This will ensure
            historical metrics are not skewed.
          </li>
          <li>
            The Closed phase should be limited to states that represent a tangible customer response: either completed
            work that is deployed to production and usable by end users or a response like "Wont Implement", "ROADMAP"
            etc that provide clarity to the customer on how their request is being handled.
          </li>
          <li>
            All work that is ready for customer use, but has not yet been released should stay in the Deliver phase.
          </li>
          <li>
            Work that is ready for development but has not been picked up for implementation should stay in the Define
            phase.
          </li>
        </ul>
      </SubSection>
      <SubSection heading={"Additional Notes"}>
        <ul>
          <li>
            Polaris analyzes the complete state transition history for work items when a work stream is initially imported.
            So it will show you every state it has seen in the transition history, even ones you are not currently
            using. You should map all of them.
          </li>
          <li>
            You can update this mapping at any time. But note that when you do, Polaris recomputes response time metrics
            for
            <em>both historical and future work items</em> using the new delivery process mapping. We currently dont have
            support for mapping updates that preserve historical metrics that use a previous mapping.
          </li>
          <li>
            A work item may transition from one state in the Closed phase to another, but this has no impact on the delivery
            cycle or response time metrics. Only the first transition into the terminal phase counts.
          </li>
        </ul>
      </SubSection>
    </>
  );
}

