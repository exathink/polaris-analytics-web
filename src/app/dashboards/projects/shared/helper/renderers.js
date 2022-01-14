import {Tag} from "antd";
import React from "react";
import {Highlighter} from "../../../../components/misc/highlighter";
import { WorkItemStateTypeColor } from "../../../shared/config";
import styles from "./renderers.module.css";

const workItemTypeImageMap = {
  story: <img src="/images/icons/story.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  task: <img src="/images/icons/task.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  subtask: <img src="/images/icons/subtask.svg" alt="#" style={{width: "16px", height: "16px"}} />,
  bug: <img src="/images/icons/bug.svg" alt="#" style={{width: "16px", height: "16px"}} />,
};

export function getStateTypeIcon(workItemType) {
  return <div style={{width: "16px", height: "16px", backgroundColor: WorkItemStateTypeColor[workItemType], borderRadius: "0.2rem", marginRight: "0.5rem"}}></div>
}

export function comboColumnTitleRender(setShowPanel, setWorkItemKey) {
  return (text, record, searchText) =>
    text && (
      <div
        onClick={() => {
          setShowPanel(true);
          setWorkItemKey(record.workItemKey || record.key);
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

export function customColumnRender({setShowPanel, setWorkItemKey, colRender = (text) => text, className}) {
  return (text, record, searchText) =>
    text && (
      <span
        onClick={() => {
          setShowPanel(true);
          setWorkItemKey(record.workItemKey || record.key);
        }}
        style={{cursor: "pointer"}}
        className={className}
      >
        {colRender(text, record)}
      </span>
    );
}