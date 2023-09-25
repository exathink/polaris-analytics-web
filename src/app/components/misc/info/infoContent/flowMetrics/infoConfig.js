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
      title={"Stability"}
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
      content={"this is the timebox"}
      showDrawer={true}
      drawerContent={"more timeboxing stuff"}
      inline={inline}
    />
  );
};