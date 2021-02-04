import React from "react";
import {Flex} from 'reflexbox';
import {withNavigationContext} from "../../navigation/components/withNavigationContext";
import {withRouter} from 'react-router';
import {EmbedVideoPlayer, useVideo} from "../videoPlayer/videoPlayer";
import uniqueStyles from './dashboard.module.css';

const WidgetMenu = ({itemSelected, showDetail, onClick}) => (
  showDetail?
    <nav className={uniqueStyles["dashboard-item-menu"]}>
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
    classes = uniqueStyles["video-detail-view"];
  }
  if (!itemSelected && showDetail) {
    classes = uniqueStyles["video-primary-view"];
  }

  return classes;
}

export const DashboardWidget = withRouter(withNavigationContext(
  ({children, name, w, title, subtitle, hideTitlesInDetailView, controls, styles, itemSelected, dashboardUrl, match, context, navigate, render, showDetail, enableVideo, videoConfig, fullScreen, ...rest}) => {
  const videoPlayerProps = useVideo();

  return (
    <Flex column w={w} m={1} className={uniqueStyles["dashboard-item"]}>
      {
        title || subtitle || controls ?
        <div className={uniqueStyles["dashboard-item-title-container"]}>
          {
            title && (!itemSelected || !hideTitlesInDetailView) ?
              <h3 className={uniqueStyles["dashboard-item-title"]}>
                {title}
              </h3>
              :
              null
          }
          {
            subtitle && (!itemSelected || !hideTitlesInDetailView) ?
              <h5 className={uniqueStyles["dashboard-item-subtitle"]}>
                {subtitle}
              </h5>
              :
              null
          }
          {
            controls ?
              <nav className={uniqueStyles["menu"] + " " + uniqueStyles["title-control-container"]} style={{...(styles ? styles.controlContainer : {})}}>
                <React.Fragment>
                  {
                    controls.reverse().map(
                      (control, index)  =>
                        <div key={index} className={uniqueStyles["title-control"]}>
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
      {!fullScreen && enableVideo && videoConfig && (
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