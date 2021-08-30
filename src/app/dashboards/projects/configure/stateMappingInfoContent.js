import classNames from "classnames";
import React from "react";
import styles from "./stateMappingInfoContent.module.css";

export function StateMappingInfoContent() {
  return (
    <div className={styles.stateMappingContentWrapper}>
      <div className={styles.mainTitle}>
        Polaris maps a delivery process into five standard phases. States in your work tracking system must be mapped to
        one of these five phases in order to compute key measurements such as lead time, cycle time, etc.
      </div>
      <div className={styles.phasesWrapper}>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.define)}>Define</div>
          <div className={styles.defineContent}>
            <p>This phase includes your active backlog as well as cards that are under definition.</p>
            <p>
              Cards for which you are writing stories, as well as cards that are ready for ready for development, but
              have not yet been picked up by a developer for implementation belong here.
            </p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.open)}>Open</div>
          <div className={styles.openContent}>
            <p>Cards that have begun implementation but are not currently being worked on by anyone, belong here.</p>
            <p>Blocked cards, cards waiting for code-review etc belong here.</p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.make)}>Make</div>
          <div className={styles.makeContent}>
            <p>Cards that are currently under implementation belong here.</p>
            <p>
              Polaris relies on commit activity to track progress during this phase, You can generally get by with just
              a single workflow state mapped to this phase.
            </p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.deliver)}>Deliver </div>
          <div className={styles.deliverContent}>
            <p>
              Cards for which implementation is complete: code changes done, code reviews complete, pull requests
              merged, and are ready for acceptance and deployment belong here.
            </p>
            <p>
              If you have a manual QA or acceptance stage, then any workflow states that track this acceptance process
              belong here.
            </p>
            <p>
              If you directly deploy code merged into a release branch to production and do accept in production, you
              deployed-to-production state should still be mapped to this phase
            </p>
          </div>
        </div>
        <div className={styles.phase}>
          <div className={classNames(styles.title, styles.closed)}>Closed</div>
          <div className={styles.closedContent}>
            <p>
              Cards with all acceptance tests complete and code changes deployed to production should be mapped to this
              phase.
            </p>
            <p>
              There may be multiple states mapped to this phase. A delivery cycle is marked complete when a card enters
              a state in this phase. Lead and Cycle Time are defined based on this.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
