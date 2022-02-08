import styles from "./components.module.css";
import {Card} from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";
import {withRouter} from "react-router";
import {truncateString} from "../../helpers/utility";

const {Meta} = Card;

export const VideoDetailView = withRouter(({match, getSelectedVideoUrl, fullScreen}) => {
  const videoUrl = getSelectedVideoUrl(match.params.selected);
  return (
    <div className={fullScreen ? styles.fullScreenDetailViewWrapper : styles.detailViewWrapper}>
        <iframe
          title="video-guidance"
          src={videoUrl}
          allow={"fullscreen"}
          frameBorder="0"
          style={{width: "100%", height: "100%"}}
        ></iframe>
    </div>
  );
});

export const VideoCard = ({name, description, thumbnail, onCardClick}) => {
  return (
    <Card
      hoverable
      style={{width: 290, objectFit: "cover", borderRadius: "5px", overflow: "hidden"}}
      cover={<img alt="example" src={thumbnail} style={{width: 290, height: 180, objectFit: "cover"}} />}
      onClick={() => onCardClick(name)}
      actions={[<PlayCircleOutlined key="playcircle" style={{fontSize: "1.5rem"}} />]}
    >
      <Meta title={""} description={truncateString(description, 70, "#6b7280")} />
    </Card>
  );
};
