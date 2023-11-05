import React from "react";
import {Flex} from "reflexbox";
import {withNavigationContext} from "../../navigation/components/withNavigationContext";
import {withRouter} from "react-router";
import uniqueStyles from "./dashboard.module.css";
import fontStyles from "../../styles/fonts.module.css";
import classNames from "classnames";
import {InfoCard} from "../../../components/misc/info/infoCard";
import {Tooltip} from "antd";
import {FullscreenExitOutlined, PieChartFilled, FullscreenOutlined, BarChartOutlined} from "@ant-design/icons";
import {Colors} from "../../../dashboards/shared/config";

export const DetailViewTooltipTypes = {
  FOCUS_VIEW: {
    tooltip: "Focus View",
    Icon: FullscreenOutlined
  },
  BAR_CHART_DETAILS_VIEW: {
    tooltip: "Analysis View",
    Icon:  BarChartOutlined
  }
}
const WidgetMenu = ({itemSelected, showDetail, onClick, infoConfig, className, showDetailTooltipType, showDetailIcon, showDetailTooltip = "Open Analysis View",  }) => {
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

  const ShowDetailIcon = showDetailTooltipType?.Icon || showDetailIcon || PieChartFilled;
  const showDetailTooltipTitle = showDetailTooltipType?.tooltip || showDetailTooltip;
  return showDetail ? (
    <div className={classNames(className??uniqueStyles.iconsWrapper, "tw-flex tw-items-center")} data-testid="analysis-view">

      <nav>
        {itemSelected ? (
          <Tooltip title={"Close"} className={classNames(("tw-pr-2"))}>
            <FullscreenExitOutlined onClick={onClick} style={{fontSize: "2.5vh", color: color}} />
          </Tooltip>
        ) : (
          <Tooltip title={showDetailTooltipTitle} className={classNames(("tw-pr-2"))}>
            <ShowDetailIcon onClick={onClick} style={{fontSize: "2.5vh", color: color}} />
          </Tooltip>
        )}
      </nav>
      {infoElement}
    </div>
  ) : (
    <React.Fragment>{infoElement}</React.Fragment>
  );
};

export const DashboardWidget = withRouter(withNavigationContext(
  ({children, name, w, title, subtitle, hideTitlesInDetailView, controls, styles, itemSelected, dashboardUrl, match, context, navigate, render, showDetail,  showDetailTooltipType, showDetailIcon, showDetailTooltip, enableVideo, videoConfig, infoConfig, fullScreen, className="", gridLayout, ...rest}) => {

  return (
    <Flex column w={w} className={classNames(uniqueStyles["dashboard-item"], className)} data-testid={name}>
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
        {...{itemSelected, showDetail,showDetailTooltipType, showDetailTooltip, showDetailIcon}}
        onClick={() => (
          itemSelected ? navigate.push(`${dashboardUrl}${context.search}`) : navigate.push(`${match.url}/${name}${context.search}`)
        )}
        infoConfig={infoConfig}
        className={rest.classNameForDetailIcon}
      />
      {
        itemSelected && showDetail ? render({view: 'detail', ...rest}) : render({view: 'primary', ...rest})
      }

    </Flex>
  )
}));