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
      content={"bar"}
      showDrawer={true}
      drawerContent={"baz"}
      inline={inline}
    />
  );
};

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