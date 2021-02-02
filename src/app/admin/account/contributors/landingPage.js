import React from "react";
import {Table} from "antd";
import {DaysRangeSlider, SIXTY_DAYS} from "../../../dashboards/shared/components/daysRangeSlider/daysRangeSlider";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Alias",
    dataIndex: "alias",
    key: "alias",
    width: "12%",
    sorter: (a, b) => a.alias.localeCompare(b.alias),
  },
  {
    title: "Latest Commit",
    dataIndex: "latestCommit",
    width: "30%",
    key: "latestCommit",
    // Should compare as dates - this is for prototype only
    sorter: (a, b) => a.latestCommit.localeCompare(b.latestCommit),
  },
  {
    title: "Total Commits",
    dataIndex: "totalCommits",
    width: "30%",
    key: "totalCommits",
    sorter: (a, b) => a.totalCommits.localeCompare(b.totalCommits),
  },
];

const data = [
  {
    key: 1,
    name: "John Brown sr.",
    alias: "jb@brown.com",
    latestCommit: "01/21/2020 08:00:00",
    totalCommits: 233,
    children: [
      {
        key: 11,
        name: "John Brown",
        alias: "jb@brown.com",
        age: 42,
        totalCommits: 20,
        latestCommit: "01/21/2020 08:00:00",
        address: "New York No. 2 Lake Park",
      },
      {
        key: 12,
        name: "John Brown Sr.",
        alias: "jb@brown.com",
        latestCommit: "01/21/2021 08:00:00",
        totalCommits: 2330,
      },
      {
        key: 13,
        name: "John Brown sr.",
        alias: "local-macbook-2002",
        latestCommit: "01/21/2021 08:00:00",
        totalCommits: 10,
      },
    ],
  },
  {
    key: 2,
    name: "Brown John III",
    alias: "jb@brown.com",
    latestCommit: "01/21/2018 08:00:00",
    totalCommits: 10,
  },
  {
    key: 3,
    name: "Aman Mavai",
    alias: "aman.mavai@gslab.com",
    latestCommit: "01/21/2018 08:00:00",
    totalCommits: 1240,
  },
  {
    key: 4,
    name: "Bill Bowers",
    alias: "bill@biweers.com",
    latestCommit: "01/21/2020 08:00:00",
    totalCommits: 233,
    children: [
      {
        key: 21,
        name: "Bill B",
        alias: "bill@bowers.com",
        age: 22,
        totalCommits: 20,
        latestCommit: "01/21/2020 08:00:00",
      },
      {
        key: 21,
        name: "Bill B",
        alias: "bill@gmail.com",
        age: 22,
        totalCommits: 20,
        latestCommit: "01/21/2020 08:00:00",
      },
    ],
  },
];
export function MergeContributorsLandingPage() {
  const [days, setDays] = React.useState(30);

  // rowSelection objects indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
  };

  return (
    <div className="mergeContributorsLandingPage">
      <div className="mergeContributorsSlider">
        <div>Latest Contribution</div>
        <div className="rangeSliderWrapper">
          <DaysRangeSlider title="" initialDays={days} setDaysRange={setDays} range={SIXTY_DAYS} />
        </div>
        <div>Days Ago</div>
      </div>
      <div className="mergeContributorsTableWrapper">
        <Table columns={columns} rowSelection={{...rowSelection}} dataSource={data} />
      </div>
    </div>
  );
}
