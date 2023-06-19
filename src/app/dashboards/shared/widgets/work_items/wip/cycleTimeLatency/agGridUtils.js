import {CaretDownOutlined, CaretUpOutlined, FilterFilled} from "@ant-design/icons";
import classNames from "classnames";
import React from "react";

export function CustomHeader(props) {
  const [ascSort, setAscSort] = React.useState("inactive");
  const [descSort, setDescSort] = React.useState("inactive");
  const [noSort, setNoSort] = React.useState("inactive");
  const refButton = React.useRef(null);

  const onMenuClicked = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    props.showColumnMenu(refButton.current);
  };

  const onSortChanged = () => {
    setAscSort(props.column.isSortAscending() ? "active" : "inactive");
    setDescSort(props.column.isSortDescending() ? "active" : "inactive");
    setNoSort(!props.column.isSortAscending() && !props.column.isSortDescending() ? "active" : "inactive");
  };

  const onSortRequested = (order, event) => {
    props.setSort(order, event.shiftKey);
  };

  React.useEffect(() => {
    props.column.addEventListener("sortChanged", onSortChanged);
    onSortChanged();
  }, []);

  let menu = null;

  if (props.enableMenu) {
    menu = (
      <div
        ref={refButton}
        className="customHeaderMenuButton tw-cursor-pointer tw-justify-self-end"
        onClick={(e) => onMenuClicked(e)}
      >
        <FilterFilled className="tw-p-1 !tw-text-[#bfbfbf] hover:!tw-bg-[rgba(0,0,0,.04)] hover:!tw-text-[rgba(0,0,0,.45)]" />
      </div>
    );
  }

  let sort = null;
  if (props.enableSorting) {
    sort = (
      <div className="tw-ml-auto tw-mr-1">
        <div className={`customSortLabel tw-flex tw-flex-col`}>
          <CaretUpOutlined
            className={classNames(
              ascSort,
              "tw-inline-block !tw-text-[11px] !tw-leading-[0.5rem] !tw-text-[#bfbfbf] hover:!tw-bg-[rgba(0,0,0,.04)] hover:!tw-text-[rgba(0,0,0,.45)]"
            )}
          />
          <CaretDownOutlined
            className={classNames(
              descSort,
              "tw-inline-block !tw-text-[11px] !tw-mt-[-3px] !tw-leading-[0.5rem] !tw-text-[#bfbfbf] hover:!tw-bg-[rgba(0,0,0,.04)] hover:!tw-text-[rgba(0,0,0,.45)]"
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="headerOne tw-flex tw-w-full tw-cursor-pointer tw-items-center tw-justify-between"
      onClick={(event) => {
        if (noSort === "active") {
          onSortRequested("asc", event);
        } else {
          if (ascSort === "active") {
            onSortRequested("desc", event);
          } else {
            onSortRequested("", event);
          }
        }
      }}
      onTouchEnd={(event) => onSortRequested("asc", event)}
    >
      <div className="customHeaderLabel">{props.displayName}</div>
      {sort}
      {menu}
    </div>
  );
}
