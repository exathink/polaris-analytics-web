import {Card} from "antd";
import {PlayCircleOutlined} from "@ant-design/icons";
import {withRouter} from "react-router";
import {truncateString} from "../../helpers/utility";

const {Meta} = Card;

export const VideoDetailView = withRouter(({match, getSelectedVideoUrl, fullScreen}) => {
  const videoUrl = getSelectedVideoUrl(match.params.selected);
  return (
    <div className={fullScreen ? "tw-w-full tw-h-[98%]" : "tw-w-full tw-h-[95%]"}>
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
      cover={
        <div className="tw-relative">
          <img alt="example" src={thumbnail} style={{width: 290, height: 180, objectFit: "cover"}} />
          <div className="tw-text3Xl tw-absolute tw-top-1/4 tw-left-auto tw-w-full tw-text-center">
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
              {name.split(" ").map((x) => (
                <div>{x}</div>
              ))}
            </div>
          </div>
        </div>
      }
      onClick={() => onCardClick(name)}
      actions={[<PlayCircleOutlined key="playcircle" style={{fontSize: "1.5rem"}} />]}
    >
      <Meta title={""} description={truncateString(description, 70, "#6b7280")} />
    </Card>
  );
};
