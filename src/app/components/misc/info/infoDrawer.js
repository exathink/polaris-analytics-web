import React, {useState} from "react";
import {Drawer} from "antd";

export const InfoDrawer = ({title, content}) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <a onClick={showDrawer}>More..</a>
      <Drawer title={title} placement="right" closable={false} onClose={onClose} visible={visible}>
        {content}
      </Drawer>
    </>
  );
};