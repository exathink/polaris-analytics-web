import classNames from "classnames";
import React from "react";
import styles from "./stateMappingInfoContent.module.css";

export function StateMappingInfoContent({header = null}) {
  return (
    <div className={styles.stateMappingContentWrapper}>
      {
        header &&
          <>
            <div className={styles.mainTitle}>Phase Definitions</div>
          </>

      }
      <div className={styles.phasesWrapper}>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.define)}>Define</div>
          <div className={styles.defineContent}>
            <p>This phase includes your active backlog as well as cards that are under definition.</p>
            <p>
              Cards in requirements mapping workflow states, and cards that are ready for development belong here.
            </p>
            <p>When a card is initially created, it starts in this phase and it marks the start of a <em>delivery cycle</em> for a card.</p>
            <p>
              The lead time clock starts ticking.
            </p>
            <p>
              The cycle time clock starts ticking whenever a card exits this phase and stops when it re-enters this phase.
            </p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.open)}>Open</div>
          <div className={styles.openContent}>
            <p>This phase is meant for cards that have begun implementation but are not currently being worked on by anyone.</p>
            <p>Blocked cards, cards waiting for code-review etc belong here.</p>
            <p>Lead and cycle time clocks continue to tick in this phase.</p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.make)}>Make</div>
          <div className={styles.makeContent}>
            <p>This phase is meant for cards that are currently in implementation.</p>
            <p>
              Cards that have been marked "in-progress" by developers belong here.
            </p>
            <p>
              When a card exits
              this phase it is considered code-complete: all code is reviewed and merged into an integration branch
              and is available to downstream stakeholders.
            </p>
            <p>Lead and cycle time clocks continue to tick in this phase.</p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.deliver)}>Deliver </div>
          <div className={styles.deliverContent}>
            <p>
              This phase is meant for code-complete cards that are ready for QA and delivery to production.
            </p>
            <p>
              If you have a manual QA or acceptance stage, prior to deployment then any workflow states that track this acceptance process
              belong here.
            </p>
            <p>
              If you continuously deploy code merged into a release branch to production and do acceptance in production, your
              deployed-to-production state should be mapped to this phase.
            </p>
            <p>Lead and cycle time clocks continue to tick in this phase.</p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.closed)}>Closed</div>
          <div className={styles.closedContent}>
            <p>
              This phase is meant for cards that are released and available to customers in production.
            </p>
            <p>
              A delivery cycle is marked complete when a card enters
              a state in this phase for the first time.
            </p>
            <p>Lead and cycle time clocks stop ticking in this phase.</p>
            <p>A new delivery cycle starts when a card transitions out of this phase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
