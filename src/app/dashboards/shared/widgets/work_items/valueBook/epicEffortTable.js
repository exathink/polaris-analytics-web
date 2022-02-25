import {InputNumber} from "antd";
import {useSearchMultiCol} from "../../../../../components/tables/hooks";
import {buildIndex, diff_in_dates, fromNow} from "../../../../../helpers/utility";
import {formatAsDate} from "../../../../../i18n/utils";
import {actionTypes} from "./valueBookDetailViewReducer";
import {injectIntl} from "react-intl";
import {StripeTable, TABLE_HEIGHTS} from "../../../../../components/tables/tableUtils";
import {comboColumnEpicTitleRender, comboColumnTitleRender} from "../../../../projects/shared/helper/renderers";

export const UncategorizedKey = "Uncategorized";
export const recordMode = {INITIAL: "INITIAL", EDIT: "EDIT"};
export function useImplementationCostTableColumns([budgetRecords, dispatch], epicWorkItems, callBacks) {
  const renderState = {render: customColRender(callBacks)};
  const titleSearchState = useSearchMultiCol(["title", "displayId", "epicName"], {customRender: customColTitleRender(callBacks)});
  const unCatRenderState = {render: unCatColRender(callBacks)};

  function setValueForBudgetRecord(key, value, initialBudgetValue) {
    dispatch({
      type: actionTypes.UPDATE_BUDGET_RECORDS,
      payload: {
        ...budgetRecords,
        [key]: {budget: value, mode: value !== initialBudgetValue ? recordMode.EDIT : recordMode.INITIAL},
      },
    });
  }

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
      sorter: (a, b) => SORTER.string_compare(a, b, "title"),
      ...titleSearchState
    },
    {
      title: "Cards",
      dataIndex: "cards",
      key: "cards",
      width: "7%",
      sorter: (a, b) => SORTER.number_compare(a, b, "cards"),
      ...unCatRenderState
    },

    {
      title: "Effort",
      children: [
        {
          title: "Budget",
          dataIndex: "budget",
          key: "budget",
          sorter: (a, b) => SORTER.number_compare(a, b, "budget"),
          width: "10%",
          render: (_text, record) => {
            if (record.key === UncategorizedKey) {
              return null;
            }
            return (
              <InputNumber
                key={record.key}
                min={0}
                max={Infinity}
                value={budgetRecords[record.key] != null ? budgetRecords[record.key].budget : ""}
                onChange={(value) => setValueForBudgetRecord(record.key, value, record.budget)}
                type="number"
              />
            );
          },
        },
        {
          title: "Actual",
          dataIndex: "totalEffort",
          key: "totalEffort",
          sorter: (a, b) => SORTER.number_compare(a, b, "totalEffort"),
          width: "7%",
          ...renderState
        },
        {
          title: "Contributors",
          dataIndex: "totalContributors",
          key: "totalContributors",
          sorter: (a, b) => SORTER.number_compare(a, b, "totalContributors"),
          width: "9%",
          ...renderState
        },
      ],
    },
    {
      title: "Progress",
      children: [
        {
          title: "Started",
          dataIndex: "startDate",
          key: "startDate",
          sorter: (a, b) => SORTER.date_compare(a, b, "startDate"),
          ...renderState
        },
        {
          title: "Ended",
          dataIndex: "endDate",
          key: "endDate",
          sorter: (a, b) => SORTER.date_compare(a, b, "endDate"),
          ...renderState
        },
        {
          title: "Last Commit",
          dataIndex: "lastUpdateDisplay",
          key: "lastUpdateDisplay",
          sorter: (a, b) => SORTER.date_compare(a, b, "lastUpdate"),
          ...renderState
        },
        {
          title: "Elapsed",
          dataIndex: "elapsed",
          key: "elapsed",
          sorter: (a, b) => SORTER.number_compare(a, b, "elapsed"),
          render: customColRenderWithDays(callBacks)
        },
      ],
    },
  ];

  return columns;
}

function edgeCaseCompare(a, b, propName) {
  if (a.key === UncategorizedKey || b.key === UncategorizedKey) {
    return 0;
  }

  const [firstVal, secondVal] = [a[propName], b[propName]];
  if (firstVal == null && secondVal == null) {
    return 0;
  }

  if (firstVal == null && secondVal != null) {
    return 1;
  }

  if (firstVal != null && secondVal == null) {
    return -1;
  }

  return null;
}

export const SORTER = {
  date_compare: (a, b, propName) => {
    const compareRes = edgeCaseCompare(a, b, propName);
    if (compareRes !== null) {
      return compareRes;
    }

    const [date_a, date_b] = [a[propName], b[propName]];
    const span = diff_in_dates(date_a, date_b);
    return span["_milliseconds"];
  },
  number_compare: (a, b, propName) => {
    const compareRes = edgeCaseCompare(a, b, propName);
    if (compareRes !== null) {
      return compareRes;
    }

    const [numa, numb] = [a[propName], b[propName]];
    return numa - numb;
  },
  string_compare: (a, b, propName) => {
    const compareRes = edgeCaseCompare(a, b, propName);
    if (compareRes !== null) {
      return compareRes;
    }

    const [stra, strb] = [a[propName], b[propName]];
    return stra.localeCompare(strb);
  },
};


function customColRender({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) => {
    if (record.type === "epic") {
      if (record.key === UncategorizedKey) {
        return null;
      } else {
        return <span className="textXs">{text}</span>;;
      }
    }
    return text && (
      <span
        onClick={() => {
          setShowPanel(true);
          setWorkItemKey(record.key);
        }}
        style={{cursor: "pointer"}}
        className="textXs"
      >
        {text}
      </span>
    );
  };
}

function customColRenderWithDays({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) => {
    if (record.type === "epic") {
      if (record.key === UncategorizedKey) {
        return null;
      } else {
        return <span className="textXs">{text} days</span>;
      }
    }
    return (
      text && (
        <span
          onClick={() => {
            setShowPanel(true);
            setWorkItemKey(record.key);
          }}
          style={{cursor: "pointer"}}
          className="textXs"
        >
          {text} days
        </span>
      )
    );
  };
}

function customColTitleRender({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) => {
    if (record.type === "epic") {
      return comboColumnEpicTitleRender(text, record, searchText);
    }
    return text && comboColumnTitleRender(setShowPanel, setWorkItemKey)(text, record, searchText)
  };
}

function unCatColRender({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) => {
    if (record.type === "epic") {
      return <span className="textXs">{text}</span>;
    }
    return (
      text && (
        <span
          onClick={() => {
            setShowPanel(true);
            setWorkItemKey(record.key);
          }}
          style={{cursor: "pointer"}}
          className="textXs"
        >
          {text}
        </span>
      )
    );
  };
}

function getEpicKey(epicKey, epicWorkItemsMap) {
  if (epicKey == null || epicWorkItemsMap.get(epicKey) == null) {
    return null;
  }
  return epicKey;
}

export function getEpicWorkItemsMap(epicWorkItems) {
  return new Map(epicWorkItems.map((x) => [x.key, x]));
}

const getNumber = (num, intl) => {
  if (num != null && num !== UncategorizedKey) {
    return intl.formatNumber(num, {maximumFractionDigits: 2});
  }
  return num;
};

const getDate = (date, intl) => {
  if (date != null && date !== UncategorizedKey) {
    return formatAsDate(intl, date);
  }
  return date;
};

function getTransformedData(epicWorkItemsMap, nonEpicWorkItems, intl) {
  const workItemsByEpic = buildIndex(
    nonEpicWorkItems,
    (wi) => getEpicKey(wi.epicKey, epicWorkItemsMap) || UncategorizedKey
  );

  const transformWorkItem = (x) => {
    return {
      ...x,
      key: x.key,
      name: x.displayId,
      title: x.name,
      cards: 1,
      type: x.workItemType,
      budget: x.budget,
      totalEffort:
        x.workItemType !== "epic"
          ? getNumber(x.effort, intl)
          : getNumber(
              workItemsByEpic[x.key].reduce((acc, item) => acc + item.effort, 0),
              intl
            ),
      totalContributors: getNumber(x.authorCount, intl),
      startDate: getDate(x.startDate, intl),
      endDate: getDate(x.endDate, intl),
      lastUpdate: getDate(x.lastUpdate, intl),
      lastUpdateDisplay:
        x.lastUpdate != null && x.lastUpdate !== UncategorizedKey ? fromNow(x.lastUpdate) : x.lastUpdate,
      elapsed: getNumber(x.elapsed, intl),
    };
  };

  const allEpics = Object.entries(workItemsByEpic).map(([epicKey, epicWorkItems]) => {
    const epicWorkItem = transformWorkItem(epicWorkItemsMap.get(epicKey));
    const epicChildItems = epicWorkItems.map(transformWorkItem);

    return {
      ...epicWorkItem,
      cards: epicChildItems.length,
      children: epicChildItems,
    };
  });

  const UncatEpic = allEpics.filter((x) => x.key === UncategorizedKey);
  const restEpics = allEpics.filter((x) => x.key !== UncategorizedKey);

  return [...UncatEpic, ...restEpics];
}

export const EpicEffortTable = injectIntl(({tableData, columns, loading, intl, rowClassName}) => {
  const [epicWorkItems, nonEpicWorkItems] = [
    tableData.filter((x) => x.workItemType === "epic"),
    tableData.filter((x) => x.workItemType !== "epic"),
  ];
  const epicWorkItemsMap = getEpicWorkItemsMap(epicWorkItems);
  const dataSource = getTransformedData(epicWorkItemsMap, nonEpicWorkItems, intl);

  return (
    <StripeTable
      key={dataSource.length === 1 ? dataSource[0]?.key : "all"}
      rowClassName={rowClassName}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      height={TABLE_HEIGHTS.FORTY_FIVE}
      data-testid="implementation-cost-table"
      expandable={{
        defaultExpandedRowKeys: dataSource.length === 1 ? [dataSource[0]?.key] : [],
        rowExpandable: true,
      }}
    />
  );
});
