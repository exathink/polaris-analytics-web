import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../framework/viz/dashboard";
import styles from "./dashboard.module.css";

const dashboard_id = "dashboards.video.instance";

export default function VideoDashboard() {
  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.videoDashboard} gridLayout={true}>
      <DashboardRow>
        <DashboardWidget
          name="video-guidance"
          title={"Video Guidance"}
          className={styles.videoPlayer}
          render={({view}) => (
            <div style={{padding: "56.25% 0 0 0", position: "relative"}}>
              <iframe
                title="video-guidance"
                src="https://vimeo.com/showcase/8025646/embed"
                allowfullscreen
                frameborder="0"
                style={{position: "absolute", top: 0, left: 0, width: "100%", height: "90%"}}
              ></iframe>
            </div>
          )}
        />
      </DashboardRow>
    </Dashboard>
  );
}
