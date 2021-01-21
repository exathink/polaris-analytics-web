import React from "react";
import {Flex} from 'reflexbox';
import {withNavigationContext} from "../../navigation/components/withNavigationContext";
import {withRouter} from 'react-router';
import {EmbedVideoPlayer, useVideo} from "../videoPlayer/videoPlayer";

const WidgetMenu = ({itemSelected, showDetail, onClick}) => (
  showDetail?
    <nav className="dashboard-item-menu">
      <i
        className={itemSelected ? "ion ion-arrow-shrink" : "ion ion-more"}
        title={"Show Details"}
        onClick={onClick}
      />
    </nav> :
    null
);

function getVideoClassNames(itemSelected, showDetail) {
  let classes;
  if (itemSelected) {
    classes = "video-detail-view";
  }
  if (!itemSelected && showDetail) {
    classes = "video-primary-view";
  }

  return classes;
}

export const DashboardWidget = withRouter(withNavigationContext(
  ({children, name, w, title, subtitle, hideTitlesInDetailView, controls, styles, itemSelected, dashboardUrl, match, context, navigate, render, showDetail, enableVideo, videoConfig, ...rest}) => {
  const videoPlayerProps = useVideo();

  return (
    <Flex column w={w} m={1} className="dashboard-item">
      {
        title || subtitle || controls ?
        <div className={"dashboard-item-title-container"}>
          {
            title && (!itemSelected || !hideTitlesInDetailView) ?
              <h3 className="dashboard-item-title">
                {title}
              </h3>
              :
              null
          }
          {
            subtitle && (!itemSelected || !hideTitlesInDetailView) ?
              <h5 className="dashboard-item-subtitle">
                {subtitle}
              </h5>
              :
              null
          }
          {
            controls ?
              <nav className={'menu title-control-container'} style={{...(styles ? styles.controlContainer : {})}}>
                <React.Fragment>
                  {
                    controls.reverse().map(
                      (control, index)  =>
                        <div key={index} className={'title-control'}>
                          {
                            itemSelected && showDetail ?
                              React.createElement(control, {...{view: 'detail'}, ...rest})
                              :
                              React.createElement(control, {...{view: 'primary'}, ...rest})
                          }
                        </div>
                    )
                  }
                </React.Fragment>

              </nav>
              :
              null
          }
        </div>
        :
        null

      }
      {enableVideo && videoConfig && (
        <EmbedVideoPlayer
          className={getVideoClassNames(itemSelected, showDetail)}
          {...videoConfig}
          {...videoPlayerProps}
        />
      )}
      <WidgetMenu
        {...{itemSelected, showDetail}}
        onClick={() => (
          itemSelected ? navigate.push(`${dashboardUrl}${context.search}`) : navigate.push(`${match.url}/${name}${context.search}`)
        )}
      />
      {
        itemSelected && showDetail ? render({view: 'detail', ...rest}) : render({view: 'primary', ...rest})
      }

    </Flex>
  )
}));