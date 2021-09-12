import {Popover} from "antd";
import {InfoDrawer} from "./infoDrawer";
import {InfoCircleOutlined} from "@ant-design/icons";
import React from "react";
import styles from "./info.module.css";

export function InfoCard({title, content, drawerContent, moreLinkText, drawerHeight, drawerWidth, showDrawer = true, showDrawerTitle= true, className = "", drawerOptions={}}) {
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
      <div className={className}>
        <InfoCircleOutlined style={{ fontSize: '12px' }}/>
      </div>
    </Popover>
  );
}


InfoCard.Section = ({heading, children}) => {
  return (
    <div>
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
    <div>
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
