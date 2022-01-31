import React from "react";
import {VideoCard} from "./components";
import styles from "./dashboard.module.css";
import img1 from "../../../image/1.jpg";
import img2 from "../../../image/2.jpg";
import img3 from "../../../image/3.jpg";
import img4 from "../../../image/4.jpg";
import img5 from "../../../image/5.jpg";

export default function VideoDashboard() {
  return (
    <div className={styles.videoDashboard}>
      <div className={styles.first}>
        <VideoCard title={"Title"} description={"Description"} thumbnail={img1} videoUrl={"https://vimeo.com/showcase/8025646/embed"} />
      </div>
      <div className={styles.second}>
        <VideoCard title={"Title"} description={"Description"} thumbnail={img2} videoUrl={"https://vimeo.com/showcase/8025646/embed"} />
      </div>
      <div className={styles.third}>
        <VideoCard title={"Title"} description={"Description"} thumbnail={img3} videoUrl={"https://vimeo.com/showcase/8025646/embed"} />
      </div>
      <div className={styles.fourth}>
        <VideoCard title={"Title"} description={"Description"} thumbnail={img4} videoUrl={"https://vimeo.com/showcase/8025646/embed"} />
      </div>
      <div className={styles.fifth}>
        <VideoCard title={"Title"} description={"Description"} thumbnail={img5} videoUrl={"https://vimeo.com/showcase/8025646/embed"} />
      </div>
      <div className={styles.sixth}>
        <VideoCard title={"Title"} description={"Description"} thumbnail={img1} videoUrl={"https://vimeo.com/showcase/8025646/embed"} />
      </div>
    </div>
  );
}
