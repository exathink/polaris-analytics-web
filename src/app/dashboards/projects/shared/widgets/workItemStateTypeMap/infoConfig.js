import classNames from "classnames";
import React from "react";
import styles from "./infoConfig.module.css";

import {InfoCard} from "../../../../../components/misc/info";

const {Section, SubSection} = InfoCard;

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
        <div className={styles.phasesWrapper}>
          <div className={styles.phase}>
            <div className={classNames(styles.title, styles.define)}>Define</div>
            <div className={styles.defineContent}>
              <p>
                This phase includes states representing your active backlog, cards that are at the design or definition stage, and cards
                that are ready for development.
              </p>
              <p>
                When a card is initially created, it starts in this phase and it marks the start of a
                <em> delivery cycle </em> for the card. The lead time clock starts ticking at this point.</p>
              <p>
                The cycle time clock starts ticking whenever a card exits this phase. It stops ticking when it re-enters
                this phase.
              </p>
            </div>
          </div>
          <div className={styles.phase}>
            <div className={classNames(styles.title, styles.open)}>Open</div>
            <div className={styles.openContent}>
              <p>
                This phase is meant for cards that are under development but are not currently being worked on by
                anyone.
              </p>
              <p>Blocked cards, cards waiting for code-review etc belong here.</p>
              <p>Lead and cycle time clocks continue to tick in this phase.</p>
            </div>
          </div>
          <div className={styles.phase}>
            <div className={classNames(styles.title, styles.make)}>Make</div>
            <div className={styles.makeContent}>
              <p>This phase is meant for cards where implementation has begun.</p>
              <p>Cards that have been marked "in-progress" by developers belong here.</p>
              <p>
                When a card exits this phase it is considered code-complete: all code is reviewed and merged into an
                integration branch and is available to downstream stakeholders.
              </p>
              <p>Lead and cycle time clocks continue to tick in this phase.</p>
            </div>
          </div>
          <div className={styles.phase}>
            <div className={classNames(styles.title, styles.deliver)}>Deliver</div>
            <div className={styles.deliverContent}>
              <p>This phase is meant for code-complete cards that are ready for QA and delivery to production.</p>
              <p>
                If you have a manual QA or acceptance stage, prior to deployment then any workflow states that track
                this acceptance process belong here.
              </p>
              <p>
                If you continuously deploy code merged into a release branch to production and do acceptance in
                production, your deployed-to-production state should be mapped to this phase.
              </p>
              <p>Lead and cycle time clocks continue to tick in this phase.</p>
            </div>
          </div>
          <div className={styles.phase}>
            <div className={classNames(styles.title, styles.closed)}>Closed</div>
            <div className={styles.closedContent}>
              <p>This phase is meant for cards that are released and available to customers in production.</p>
              <p>A delivery cycle is completed when a card enters a state in this phase.</p>
              <p>Lead and cycle time clocks stop ticking in this phase.</p>
              <p>A new delivery cycle starts when a card transitions out of this phase.</p>
            </div>
          </div>
        </div>
      </SubSection>
    </>
  );
}
