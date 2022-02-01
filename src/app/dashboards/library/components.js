import styles from "./components.module.css";
import {Card} from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";
import {withRouter} from "react-router";
const {Meta} = Card;

export const VideoDetailView = withRouter(({match, getSelectedVideoUrl, fullScreen}) => {
  const videoUrl = getSelectedVideoUrl(match.params.selected);
  return (
    <div className={styles.detailViewWrapper}>
      <div style={{padding: fullScreen ? "61.25% 0 0 0": "50.25% 0 5% 0", position: "relative"}}>
        <iframe
          title="video-guidance"
          src={videoUrl}
          allow={"fullscreen"}
          allowfullscreen
          frameborder="0"
          style={{position: "absolute", top: 0, left: 0, width: "100%", height: "98%"}}
        ></iframe>
      </div>
    </div>
  );
});

export const VideoCard = ({name, description, thumbnail, onCardClick}) => {
  return (
    <Card
      hoverable
      style={{width: 290, objectFit: "cover"}}
      cover={<img alt="example" src={thumbnail} style={{width: 290, height: 180, objectFit: "cover"}} />}
      onClick={() => onCardClick(name)}
      actions={[<PlayCircleOutlined key="playcircle" style={{fontSize: "1.5rem"}} />]}
    >
      <Meta title={""} description={description} />
    </Card>
  );
};
