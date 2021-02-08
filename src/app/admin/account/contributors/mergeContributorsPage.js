import React from "react";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import styles from "./contributors.module.css";

function MergeContributorsPage({viewerContext, renderActionButtons}) {
  return <div className={styles.mergeContributorsLandingPage}>{renderActionButtons(false)}</div>;
}

export default withViewerContext(MergeContributorsPage);
