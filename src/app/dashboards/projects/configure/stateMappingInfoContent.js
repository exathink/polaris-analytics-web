import classNames from "classnames";
import React from "react";
import styles from "./stateMappingInfoContent.module.css";

export function StateMappingInfoContent() {
  return (
    <div className={styles.stateMappingContentWrapper}>
      <div className={styles.mainTitle}>
        <p>Polaris maps a delivery process into five standard phases.</p>
        <p>States in your workflow must be mapped to
        one of these five phases in order to compute key measurements such as lead time and cycle time.</p>
      </div>
      <div className={styles.phasesWrapper}>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.define)}>Define</div>
          <div className={styles.defineContent}>
            <p>This phase includes your active backlog as well as cards that are under definition.</p>
            <p>
              Cards in requirements mapping workflow states, and cards that are ready for development belong here.
            </p>
            <p>
              The lead time clock starts ticking when a card enters this phase for the first time in a delivery cycle.
            </p>
            <p>
              The cycle time clock starts ticking when a card exits this phase for the first time in a delivery cycle.
            </p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.open)}>Open</div>
          <div className={styles.openContent}>
            <p>This phase is meant for cards that have begun implementation but are not currently being worked on by anyone.</p>
            <p>Blocked cards, cards waiting for code-review etc belong here.</p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.make)}>Make</div>
          <div className={styles.makeContent}>
            <p>This phase has cards that are currently under implementation.</p>
            <p>
              Cards that have been marked "in-progress" by developers belong here.
            </p>
            <p>
              When a card exits
              this phase it is considered code-complete: all code is reviewed and merged into an integration branch
              and is available to downstream stakeholders.
            </p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.deliver)}>Deliver </div>
          <div className={styles.deliverContent}>
            <p>
              This phase is meant for code-complete cards ready for QA and delivery to production.
            </p>
            <p>
              If you have a manual QA or acceptance stage, prior to deployment then any workflow states that track this acceptance process
              belong here.
            </p>
            <p>
              If you continuously deploy code merged into a release branch to production and do acceptance in production, your
              deployed-to-production state should be mapped to this phase
            </p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.closed)}>Closed</div>
          <div className={styles.closedContent}>
            <p>
              This phase is meant for cards that are released and available to customers in production.
            </p>
            <p>
              There may be multiple states mapped to this phase.
            </p>
            <p>
              A delivery cycle is marked complete when a card enters
              a state in this phase for the first time.
            </p>
            <p>
              Lead and Cycle Time are defined based on this.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
