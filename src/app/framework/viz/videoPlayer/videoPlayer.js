import React from "react";
import {Drawer} from "antd";
import ReactPlayer from "react-player";
import "./videoPlayer.css";

function getPlaySVG() {
  return (
    <svg width="25" height="25" fill="none" viewBox="0 0 90 90">
      <circle
        class="text-gray-300 dark:text-gray-500"
        cx="25"
        cy="25"
        r="24"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path d="M 15 10 v 28 L 39 24 Z" fill="currentColor" stroke="black" />
    </svg>
  );
}

function getPauseSVG() {
  return (
    <svg width="25" height="25" fill="none" viewBox="0 0 90 90">
      <circle
        class="text-gray-300 dark:text-gray-500"
        cx="25"
        cy="25"
        r="24"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path d="M18 16h4v18h-4V16zM28 16h4v18h-4z" fill="currentColor" />
    </svg>
  );
}

const VIDEO_STATES = {
  PLAY: "PLAY",
  PAUSE: "PAUSE",
};

// custom hook to abstract video component state
export function useVideo() {
  const [playState, setPlayState] = React.useState(VIDEO_STATES.PAUSE);
  const [visible, setVisible] = React.useState(false);

  function handleVideoIconClick() {
    setPlayState(VIDEO_STATES.PLAY);
    setVisible(true);
  }

  function onClose() {
    setVisible(false);
    setPlayState(VIDEO_STATES.PAUSE);
  }

  function getIconSvg() {
    if (playState === VIDEO_STATES.PAUSE) {
      return getPlaySVG();
    }

    return getPauseSVG();
  }

  return {
    videoIcon: getIconSvg(),
    handleVideoIconClick,
    visible,
    playState,
    onClose,
    onPlay: () => setPlayState(VIDEO_STATES.PLAY),
    onPause: () => setPlayState(VIDEO_STATES.PAUSE),
  };
}

// currently we are using this player, we should be able to easily replace if required.
export function VideoPlayer({url, playState, onPlay, onPause}) {
  return (
    <ReactPlayer
      width="100%"
      height="100%"
      url={url}
      playing={playState === VIDEO_STATES.PLAY}
      controls={true}
      onPlay={onPlay}
      onPause={onPause}
      // light={true} // pass image url here if we want to show different preview image
    />
  );
}

export function EmbedVideoPlayer({
  enableVideo,
  // videoConfig Props
  url,
  title = "Default Title",
  VideoDescription = () => null,
  // state props from hook
  visible,
  onClose,
  onPlay,
  onPause,
  playState,
  // state props for video icon
  videoIcon,
  handleVideoIconClick,
}) {
  if (!enableVideo) {
    return null;
  }

  return (
    <>
      <span onClick={handleVideoIconClick} className="video-player-icon">
        {videoIcon}
      </span>
      <Drawer width={720} title={title} onClose={onClose} visible={visible}>
        <div className="video-player-wrapper">
          <div className="video-player">
            <VideoPlayer url={url} onPlay={onPlay} onPause={onPause} playState={playState} />
          </div>
          <div className="description-wrapper">
            <VideoDescription />
          </div>
        </div>
      </Drawer>
    </>
  );
}
