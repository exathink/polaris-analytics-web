import React from "react";

import {InfoCard, PhaseDefinitions} from "../../index";


const {Section, SubSection} = InfoCard;

export const DeliveryProcessMappingInfoConfig = {
  title:"Delivery Process Mapping",
  headerContent: () => (
    <DeliveryProcessMappingSummary/>
  ),
  showDrawer: true,
  drawerContent: () => (
    <DeliveryProcessMappingDetails/>
  ),
  showDrawerTitle: false,
  drawerOptions: {
    width: "68vw"
  }
}


export function DeliveryProcessMappingSummary() {
  return (
    <>
      <Section>
        <p>
          Polaris models a delivery process with a mapping that takes states in your workflow into five standard phases that represent
          the key stages in the software development lifecycle.
        </p>
        <h4>Key Functions</h4>
        Drag and drop model configuration to specify
        <ul>
          <li>The definition of done.</li>
          <li>The definition of response time.</li>
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
          Polaris models a delivery process with a mapping that takes states in your workflow into five standard phases that represent
          the key stages in the software development lifecycle.
        </p>
        <p>
          The model is based on a concept called the
          <em> delivery cycle, </em> that tracks the work required to take an increment of customer value from
          definition through release.
        </p>
        <SubSection heading={"Key Ideas"}>
          <ul>
            <li>
              Cards in your work tracking system represent the increments of value and we map card states in your
              delivery workflow into the five standard phases.
            </li>
            <li>
              A card may require one <em>or more</em> delivery cycles in your process before it reaches a customer.
            </li>
            <li>The delivery process mapping defines when a delivery cycle starts and ends.</li>
            <li>
              Key response time metrics such as lead time and cycle time are defined in terms of the <em>cumulative</em> time
              spent by a card in the phases defined by this mapping.
            </li>
          </ul>
        </SubSection>

        <SubSection heading={"The Phases"}>
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
            definitions. You must be an organization owner to configure this mapping, otherwise drag and drop is disabled.
          </li>
          <li>
            Time spent in unmapped states is not included in response time calculations, so you should map every all
            unmapped states even if you are not currently using some of them in your current workflow. This will ensure
            historical metrics are not skewed.
          </li>
          <li>
            The Closed phase should be limited to states that represent a tangible customer response:  either
            completed work that is usable by end users or a response like "Wont Implement", "ROADMAP" etc that provide
            clarity to the customer on how their request is being handled.
          </li>
          <li>
            A card may transition from one state in the Closed phase to another, but this has no impact on the delivery
            cycle or response time metrics. Only the first transition into the Closed phase counts.
          </li>
          <li>All work that is
            ready for customer use, but has not yet been released should stay in the Deliver phase.
          </li>
          <li>
            Work that is ready for development but has not been picked up for implementation should stay in the Define phase.
          </li>

        </ul>
      </SubSection>
      <SubSection heading={"Additional Notes"}>
        <ul>
          <li>
            Polaris analyzes the complete state transition history for cards when a work stream is initially imported.
            So it will show you every state it has seen it the transition history, even ones you are not currently using.
            You should map all of them.
          </li>
          <li>
            You can update this mapping at any time. But note that when you do, Polaris recomputes response time metrics
            for
            <em>both historical and future cards</em> using the new delivery process mapping. We currently dont have support for
            mapping updates that preserve historical metrics that use a previous mapping.
          </li>

          <li>
            While lead time is defined entirely in terms of the delivery cycle start and end, the definition of cycle time in Polaris
            is more nuanced and takes into account commit level information in addition cumulative time spent in the
            active phases.
          </li>
        </ul>
      </SubSection>
    </>
  );
}

