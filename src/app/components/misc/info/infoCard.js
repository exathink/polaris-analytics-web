import {Popover} from "antd";
import {InfoDrawer} from "./infoDrawer";
import {InfoCircleFilled} from "@ant-design/icons";
import React from "react";
import styles from "./info.module.css";
import {Colors} from "../../../dashboards/shared/config";

export function InfoCard({title, content, drawerContent, moreLinkText, drawerHeight, drawerWidth, showDrawer = true, showDrawerTitle= true, className = "", drawerOptions={}, inline=false}) {
  const color = Colors.DashboardWidgetIcons.primary;
  return (
    <Popover

      content={
        <div>
          <h2>{title}</h2>
          <div className={styles.infoCardContent}>{content}</div>
          {
            showDrawer &&
              <InfoDrawer title={showDrawerTitle ? title : null} content={drawerContent} moreLinkText={moreLinkText}
                          width={drawerWidth} height={drawerHeight} drawerOptions={drawerOptions} />
          }
        </div>
      }
    >
      {
        inline
          ? <InfoCircleFilled style={{ fontSize: '2.5vh', color: color }}/>
          : <div className={className}>
              <InfoCircleFilled style={{ fontSize: '2.5vh', color: color }}/>
            </div>
      }
    </Popover>
  );
}


InfoCard.Section = ({heading, children}) => {
  return (
    <div className={styles.section}>
      {
        heading &&
          <h3 className={styles.sectionHeading}>
            {heading}
          </h3>
      }
      {children}
    </div>
  )
}

InfoCard.SubSection = ({heading, children}) => {
  return (
    <div className={styles.subSection}>
      {
        heading &&
          <h4 className={styles.sectionHeading}>
            {heading}
          </h4>
      }
      {children}
    </div>
  )
}
