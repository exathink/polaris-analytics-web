import React from "react";
import {VideoCard, VideoDetailView} from "./components";
import styles from "./dashboard.module.css";
import video_bg_img from "./images/video_bg.jpg";
import img1 from "../../../image/1.jpg";
import img2 from "../../../image/2.jpg";
import {withDetailRoutes} from "../../framework/viz/dashboard/withDetailRoutes";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";

const allCardsData = [
  {name: "UX Conventions", description: "Perspectives, Topics and Navigation", videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title2", description: "Description", videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title3", description: "Description", videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title4", description: "Description", videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title5", description: "Description", videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title6", description: "Description", videoUrl: "https://vimeo.com/showcase/8025646/embed"},
];
// background images to be used for video card
const ALL_BG_IMGS = [video_bg_img, img1, img2];

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
      {allCardsData.map((video, index) => {
        const thumbnail = ALL_BG_IMGS[index%ALL_BG_IMGS.length]
        return (
          <div key={video.name} className={styles.card}>
            <VideoCard {...video} thumbnail={thumbnail} dashboardUrl={dashboardUrl} onCardClick={onCardClick} itemSelected={itemSelected} />
          </div>
        );
      })}
    </div>
  );
}

export default withNavigationContext(withDetailRoutes(VideoDashboard));
