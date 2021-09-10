import React, {useState} from "react";
import {Drawer, Button} from "antd";
import styles from "./info.module.css";

export const InfoDrawer = ({title, content, moreLinkText, drawerOptions}) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <div className={styles.drawerContainer}>
      <Button type={'link'} onClick={showDrawer} className={styles.moreButton}>
        { moreLinkText || "More.."}
      </Button>
      <Drawer title={<div className={styles.drawerTitle}>{title}</div>} placement="right" closable={false} onClose={onClose} visible={visible} {...drawerOptions}>
        {content}
      </Drawer>
    </div>
  );
};