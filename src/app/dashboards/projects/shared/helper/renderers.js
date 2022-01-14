import {Tag} from "antd";
import React from "react";
import {Highlighter} from "../../../../components/misc/highlighter";
import styles from "./renderers.module.css";

const workItemTypeImageMap = {
  story: <img src="/images/icons/story.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  task: <img src="/images/icons/task.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  bug: <img src="/images/icons/bug.svg" alt="#" style={{width: "16px", height: "16px"}} />,
};

export function comboColumnTitleRender(setShowPanel, setWorkItemKey) {
  return (text, record, searchText) =>
    text && (
      <div
        onClick={() => {
          setShowPanel(true);
          setWorkItemKey(record.workItemKey);
        }}
        className={styles.comboCardCol}
      >
        <div className={styles.workItemType}>{workItemTypeImageMap[record.workItemType] ?? record.workItemType}</div>
        <div className={styles.title}>
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={searchText || ""}
            textToHighlight={text.toString()}
          />
        </div>
        <div className={styles.displayId}>
          {record.displayId}{" "}
          {record.epicName && (
            <Tag color="#108ee9" style={{marginLeft: "30px"}}>
              {record.epicName}
            </Tag>
          )}
        </div>
      </div>
    );
}
