import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../framework/viz/dashboard";
import {VideoCard} from "./lib";
import styles from "./dashboard.module.css";

const dashboard_id = "dashboards.video.instance";

export default function VideoDashboard() {
  return (
    <Dashboard dashboard={`${dashboard_id}`} className={styles.videoDashboard} gridLayout={true}>
      <DashboardRow>
        <DashboardWidget
          name="video-guidance"
          title={""}
          className={styles.videoPlayer}
          render={({view}) => (
            <VideoCard view={view} title={"Title"} description={"Description"} videoUrl={"https://vimeo.com/showcase/8025646/embed"}/>
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}
