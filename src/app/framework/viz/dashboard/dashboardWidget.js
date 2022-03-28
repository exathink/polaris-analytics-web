import React from "react";
import {Flex} from "reflexbox";
import {withNavigationContext} from "../../navigation/components/withNavigationContext";
import {withRouter} from "react-router";
import uniqueStyles from "./dashboard.module.css";
import fontStyles from "../../styles/fonts.module.css";
import classNames from "classnames";
import {InfoCard} from "../../../components/misc/info/infoCard";
import {Tooltip} from "antd";
import {FullscreenExitOutlined, PieChartFilled} from "@ant-design/icons";
import {Colors} from "../../../dashboards/shared/config";

const WidgetMenu = ({itemSelected, showDetail, onClick, infoConfig}) => {
  const infoElement = infoConfig && (
    <InfoCard
      title={infoConfig.title}
      content={infoConfig.headerContent()}
      showDrawer={infoConfig.showDrawer}
      drawerContent={infoConfig.showDrawer ? infoConfig.drawerContent() : null}
      drawerOptions={infoConfig.drawerOptions}
      moreLinkText={infoConfig.moreLinkText}
      showDrawerTitle={infoConfig.showDrawerTitle}
      drawerWidth={infoConfig.drawerWidth}
      drawerHeight={infoConfig.drawerHeight}
      className={showDetail ? uniqueStyles.shiftInfo : uniqueStyles.infoCardWrapper}
    />
  );
  const color = Colors.DashboardWidgetIcons.primary;

  return showDetail ? (
    <div className={uniqueStyles.iconsWrapper}>
      {infoElement}
      <nav>
        {itemSelected ? (
          <Tooltip title={"Close Analysis View"}>
            <FullscreenExitOutlined onClick={onClick} style={{fontSize: "2.5vh", color: color}} />
          </Tooltip>
        ) : (
          <Tooltip title={"Open Analysis View"}>
            <PieChartFilled onClick={onClick} style={{fontSize: "2.5vh", color: color}} />
          </Tooltip>
        )}
      </nav>
    </div>
  ) : (
    <React.Fragment>{infoElement}</React.Fragment>
  );
};

export const DashboardWidget = withRouter(withNavigationContext(
  ({children, name, w, title, subtitle, hideTitlesInDetailView, controls, styles, itemSelected, dashboardUrl, match, context, navigate, render, showDetail, enableVideo, videoConfig, infoConfig, fullScreen, className="", gridLayout, ...rest}) => {

  return (
    <Flex column w={w} className={classNames(uniqueStyles["dashboard-item"], className)}>
      {
        title || subtitle || controls ?
        <div className={uniqueStyles["dashboard-item-title-container"]}>
          {
            title && (!itemSelected || !hideTitlesInDetailView) ?
              <h3 className={classNames(uniqueStyles["dashboard-item-title"], fontStyles["text-lg"], fontStyles["font-normal"])}>
                {title}
              </h3>
              :
              null
          }
          {
            subtitle && (!itemSelected || !hideTitlesInDetailView) ?
              <h5 className={classNames(fontStyles["text-xs"], fontStyles["font-normal"])}>
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