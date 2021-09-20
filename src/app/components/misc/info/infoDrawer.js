import React, {useState} from "react";
import {Drawer} from "antd";
import Button from "../../../../components/uielements/button";
import styles from "./info.module.css";

export const InfoDrawer = ({title, content, moreLinkText,  drawerOptions}) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <div className={styles.drawerContainer}>
      <Button  type={'primary'}  size={'small'} onClick={showDrawer}>
        { moreLinkText || "Learn more.."}
      </Button>
      <Drawer placement="right" width={"65vw"} closable={false} onClose={onClose} visible={visible} {...drawerOptions}>

        <div className={styles.infoDrawerContent}>
          {
            title &&
            <h2>{title}</h2>
          }
          {content}
        </div>
      </Drawer>
    </div>
  );
};