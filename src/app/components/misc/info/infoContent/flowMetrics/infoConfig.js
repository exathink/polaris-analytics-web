/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import React from "react";

import { Glossary, InfoCard } from "../../index";


const { Section, SubSection } = InfoCard;

export function StabilityInfoCard({ inline = true }) {
  return (
    <InfoCard
      title={"Flow Stability"}
      content={<StabilityInfoSummary/>}
      showDrawer={false}
      drawerContent={"baz"}
      inline={inline}
    />
  );
};

function StabilityInfoSummary() {
  return (
    <>
      <Section>
        <p>
          It is relatively easy to release <em>something</em> every <em>N</em> days.
        </p>
        <p>But it is much harder to release everything you <em>started</em> working on, <em>within N days</em>.</p>
        <p>If your delivery process can do this for some fixed <em>N</em>, it is a <em>stable</em> process.</p>

        <p>
          The data and analytics from this dashboard can be used to tell if your development process is unstable, and guide you on how to stabilize it.
        </p>
      </Section>
    </>
  )
}

export function TimeboxInfoCard({ inline = true }) {
  return (
    <InfoCard
      title={"TimeBox"}
      content={<TimeBoxInfoSummary/>}
      showDrawer={false}
      drawerContent={"more timeboxing stuff"}
      inline={inline}
    />
  );
};

function TimeBoxInfoSummary() {
  return (
    <>
      <Section>
        <p>
          The TimeBox is the key enabling constraint that we use to stabilize the flow of work items in the process.
        </p>
        <p>
          This is the value of <em>N</em> that we use in our definition flow stability.
        </p>
        <p>We want any work item that is in an active phase: code, ship or open,  to complete <em>within N days</em></p>

      </Section>
    </>
  )
}