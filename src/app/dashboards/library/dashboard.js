import React from "react";
import {VideoCard, VideoDetailView} from "./components";
import styles from "./dashboard.module.css";
import video_bg_img from "./images/video_bg.jpg";
import img4 from "../../../image/4.jpg";
import img5 from "../../../image/5.jpg";
import img6 from "../../../image/6.jpg";
import {withDetailRoutes} from "../../framework/viz/dashboard/withDetailRoutes";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";

const allCardsData = [
  {name: "UX Conventions", description: "Perspectives, Topics and Navigation", thumbnail: video_bg_img, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title2", description: "Description", thumbnail: video_bg_img, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title3", description: "Description", thumbnail: video_bg_img, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title4", description: "Description", thumbnail: img4, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title5", description: "Description", thumbnail: img5, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title6", description: "Description", thumbnail: img6, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
];

export function VideoDashboard({dashboardUrl, itemSelected, navigate, context, fullScreen}) {
  function onCardClick(name) {
    itemSelected
      ? navigate.push(`${dashboardUrl}${context.search}`)
      : navigate.push(`${dashboardUrl}/${name}${context.search}`);
  }

  // find the selected VideoCard and render that or show all video cards
  if (itemSelected) {
    return <VideoDetailView fullScreen={fullScreen} getSelectedVideoUrl={name => allCardsData.find(x => x.name===name)?.videoUrl} />;
  }

  return (
    <div className={styles.videoDashboard}>
      {allCardsData.map((video) => {
        return (
          <div key={video.name} className={styles.card}>
            <VideoCard {...video} dashboardUrl={dashboardUrl} onCardClick={onCardClick} itemSelected={itemSelected} />
          </div>
        );
      })}
    </div>
  );
}

export default withNavigationContext(withDetailRoutes(VideoDashboard));
