import React from "react";
import {Flex} from 'reflexbox';
import {withNavigationContext} from "../../navigation/components/withNavigationContext";
import {withRouter} from 'react-router';
import uniqueStyles from './dashboard.module.css';
import classNames from "classnames";
import {InfoCard} from "../../../components/misc/info/infoCard";

const WidgetMenu = ({itemSelected, showDetail, onClick, infoConfig}) => {
  const infoElement = infoConfig && (
    <InfoCard
      title={infoConfig.title}
      content={infoConfig.content()}
      content1={infoConfig.content1()}
      className={showDetail ? uniqueStyles.shiftInfo  : uniqueStyles.infoCardWrapper}
    />
  );

  return showDetail ? (
    <div className={uniqueStyles.iconsWrapper}>
      {infoElement}
      <nav>
        <i
          className={itemSelected ? "ion ion-arrow-shrink" : "ion ion-more"}
          title={"Show Details"}
          onClick={onClick}
        />
      </nav>
    </div>
  ) : (
    <React.Fragment>{infoElement}</React.Fragment>
  );
};

export const DashboardWidget = withRouter(withNavigationContext(
  ({children, name, w, title, subtitle, hideTitlesInDetailView, controls, styles, itemSelected, dashboardUrl, match, context, navigate, render, showDetail, enableVideo, videoConfig, infoConfig, fullScreen, className="", gridLayout, ...rest}) => {
  const margin = gridLayout ? {}: {m: 1};
  return (
    <Flex column w={w} {...margin} className={classNames(uniqueStyles["dashboard-item"], className)}>
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
              <nav className={"menu " + uniqueStyles["title-control-container"]} style={{...(styles ? styles.controlContainer : {})}}>
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
      <WidgetMenu
        {...{itemSelected, showDetail}}
        onClick={() => (
          itemSelected ? navigate.push(`${dashboardUrl}${context.search}`) : navigate.push(`${match.url}/${name}${context.search}`)
        )}
        infoConfig={infoConfig}
      />
      {
        itemSelected && showDetail ? render({view: 'detail', ...rest}) : render({view: 'primary', ...rest})
      }

    </Flex>
  )
}));