import {Popover} from "antd";
import {InfoDrawer} from "./infoDrawer";
import {InfoCircleOutlined} from "@ant-design/icons";
import React from "react";
import styles from "./info.module.css";

export function InfoCard({title, content, drawerContent, moreLinkText, showDrawerTitle= true, className = "", drawerOptions={}}) {
  return (
    <Popover
      title= {<div style={{textAlign: "center", maxWidth: "500px", margin: "20px"}}><h2>{title}</h2></div>}
      content={
        <div>
          <div className={styles.infoCardContent}>{content}</div>
          <InfoDrawer title={showDrawerTitle ? title : null} content={drawerContent} moreLinkText={moreLinkText} drawerOptions={drawerOptions}/>
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
