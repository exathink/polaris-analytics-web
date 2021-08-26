import React from "react";
import styles from "./stateMappingInfoContent.module.css";

export function StateMappingInfoContent() {
  return (
    <div className={styles.stateMappingContentWrapper}>
      <div className={styles.title}>
        Polaris maps a delivery process into five standard phases. States in your work tracking system must be mapped to
        one of these five phases in order to compute key measurements such as lead time, cycle time, etc.
      </div>
      <div className={styles.phase}>
        <div>Define</div>
        <div>
          This phase includes your active backlog as well as cards that are under definition. Cards for which you are
          writing stories, as well as cards that are ready for ready for development, but have not yet been picked up by
          a developer for implementation belong here.
        </div>
      </div>
      <div className={styles.phase}>
        <div>Make</div>
        <div>
          Cards that are currently under implementation belong here. Polaris relies on commit activity to track progress
          during this phase, You can generally get by with just a single workflow state mapped to this phase.
        </div>
      </div>
      <div className={styles.phase}>
        <div>Deliver </div>
        <div>
          Cards for which implementation is complete: code changes done, code reviews complete, pull requests merged,
          and are ready for acceptance and deployment belong here. If you have a manual QA or acceptance stage, then any
          workflow states that track this acceptance process belong here. If you directly deploy code merged into a
          release branch to production and do accept in production, you deployed-to-production state should still be
          mapped to this phase
        </div>
      </div>
      <div className={styles.phase}>
        <div>Closed</div>
        <div>
          Cards with all acceptance tests complete and code changes deployed to production should be mapped to this
          phase. There may be multiple states mapped to this phase. A delivery cycle is marked complete when a card
          enters a state in this phase. Lead and Cycle Time are defined based on this.
        </div>
      </div>
      <div className={styles.phase}>
        <div>Open</div>
        <div>
          Cards that have begun implementation but are not currently being worked on by anyone, belong here. Blocked
          cards, cards waiting for code-review etc belong here.
        </div>
      </div>
    </div>
  );
}
