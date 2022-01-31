import styles from "./components.module.css";
import {Card} from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";
const {Meta} = Card;

export function VideoDetailView({videoUrl}) {
  return (
    <div className={styles.detailViewWrapper}>
      <div style={{padding: "56.25% 0 0 0", position: "relative"}}>
        <iframe
          title="video-guidance"
          src={videoUrl}
          allowfullscreen
          frameborder="0"
          style={{position: "absolute", top: 0, left: 0, width: "100%", height: "90%"}}
        ></iframe>
      </div>
    </div>
  );
}

export function VideoCard({view, title, description, thumbnail, videoUrl}) {
  function handleCardClick() {
    
  }
  if (view === "detail") {
    return <VideoDetailView videoUrl={videoUrl} />;
  }
  return (
    <Card
      hoverable
      style={{width: 290, objectFit: "cover"}}
      cover={<img alt="example" src={thumbnail} style={{width: 290, height: 180, objectFit: "cover"}}/>}
      onClick={handleCardClick}
      actions={[
        <PlayCircleOutlined  key="playcircle" style={{fontSize: "1.5rem"}}/>,
    ]}
    >
      <Meta title={""} description={description} />
    </Card>
  );
}
