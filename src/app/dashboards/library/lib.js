import styles from "./lib.module.css";

export function VideoDetailView({videoUrl}) {
  return (
    <div className={styles.detailViewWrapper}>
      <div style={{padding: "56.25% 0 0 0", position: "relative"}}>
        <iframe
          title="video-guidance"
          // src="https://vimeo.com/showcase/8025646/embed"
          src={videoUrl}
          allowfullscreen
          frameborder="0"
          style={{position: "absolute", top: 0, left: 0, width: "100%", height: "90%"}}
        ></iframe>
      </div>
    </div>
  );
}

export function VideoCard({view, title, description, videoUrl}) {
  if (view === "detail") {
    return <VideoDetailView videoUrl={videoUrl} />;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}
