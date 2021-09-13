import React from "react";

import {InfoCard, PhaseDefinitions} from "../../index";


const {Section, SubSection} = InfoCard;

export const DeliveryProcessMappingInfoConfig = {
  title:"Delivery Process Mapping",
  headerContent: () => (
    <DeliveryProcessMappingSummary/>
  ),
  moreLinkText: "Mapping guidelines...",
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
          Model your delivery process in Polaris by mapping states in your delivery workflow into one of five standard
          <em> phases </em>.
        </p>
        <p>
          Key response time metrics like lead and cycle time are defined in terms of cumulative time spent in these
          phases.
        </p>
      </Section>
    </>
  );
}

export function DeliveryProcessMappingDetails() {
  return (
    <>
      <Section heading={"Mapping Guidelines"}>
        <p>
          For each work stream, drag a workflow state to its Polaris phase.
          <em> Drag and drop mapping is disabled if you are not an organization owner. </em>
        </p>
        <p>Note: </p>
        <ul>
          <li>
            Polaris
            analyzes state transition history for cards, and will show you every state for it has recorded at least one state transition
            involving a state. So every workflow state that is shown as unmapped, including ones you are not actively using now, should be mapped.
          </li>
          <li>
            Time spent in unmapped states is not included in response time calculations, so not mapping them can skew
            your metrics.
          </li>
          <li>
            You can update this mapping at any time. But note that when you do, Polaris recomputes response time metrics
            for
            <em>both historical and future cards</em> using the new delivery process mapping.
          </li>
        </ul>
      </Section>
      <SubSection heading={"Phase Definitions"}>
        <PhaseDefinitions/>
      </SubSection>
    </>
  );
}

