import React from "react";
import {VideoCard, VideoDetailView} from "./components";
import styles from "./dashboard.module.css";
import img1 from "../../../image/1.jpg";
import img2 from "../../../image/2.jpg";
import img3 from "../../../image/3.jpg";
import img4 from "../../../image/4.jpg";
import img5 from "../../../image/5.jpg";
import img6 from "../../../image/6.jpg";
import {withDetailRoutes} from "../../framework/viz/dashboard/withDetailRoutes";
import {withNavigationContext} from "../../framework/navigation/components/withNavigationContext";

const allCardsData = [
  {name: "title1", description: "Description", thumbnail: img1, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title2", description: "Description", thumbnail: img2, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title3", description: "Description", thumbnail: img3, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title4", description: "Description", thumbnail: img4, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title5", description: "Description", thumbnail: img5, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
  {name: "title6", description: "Description", thumbnail: img6, videoUrl: "https://vimeo.com/showcase/8025646/embed"},
];

export function VideoDashboard({dashboardUrl, itemSelected, navigate, context}) {
  function onCardClick(name) {
    itemSelected
      ? navigate.push(`${dashboardUrl}${context.search}`)
      : navigate.push(`${dashboardUrl}/${name}${context.search}`);
  }

  // find the selected VideoCard and render that or show all video cards
  if (itemSelected) {
    return <VideoDetailView mapping={allCardsData} />;
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
