import React from "react";
import {Table} from "antd";
import {DaysRangeSlider, SIXTY_DAYS} from "../../../dashboards/shared/components/daysRangeSlider/daysRangeSlider";
import {useSearch} from "../../../components/tables/hooks";

const data = [
  {
    key: 1,
    name: "John Brown sr.",
    alias: "jb@brown.com",
    latestCommit: "01/21/2020 08:00:00",
    totalCommits: 233,
    contributorAliases: [
      {
        key: 11,
        name: "John Brown",
        alias: "jb@brown.com",
        latestCommit: "01/21/2020 08:00:00",
        totalCommits: 20,
        parent: 1,
      },
      {
        key: 12,
        name: "John Brown Sr.",
        alias: "jb@brown.com",
        latestCommit: "01/21/2021 08:00:00",
        totalCommits: 2330,
        parent: 1,
      },
      {
        key: 13,
        name: "John Brown sr.",
        alias: "local-macbook-2002",
        latestCommit: "01/21/2021 08:00:00",
        totalCommits: 10,
        parent: 1,
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
    contributorAliases: [
      {
        key: 21,
        name: "Bill B",
        alias: "bill@bowers.com",
        latestCommit: "01/21/2020 08:00:00",
        totalCommits: 20,
        parent: 4,
      },
      {
        key: 22,
        name: "Bill B",
        alias: "bill@gmail.com",
        latestCommit: "01/21/2020 08:00:00",
        totalCommits: 20,
        parent: 4,
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
    getCheckboxProps: (record) => ({
      disabled: record.parent != null, // Column configuration not to be checked
      name: record.name,
    }),
  };

  const [nameSearchState, aliasSearchState] = [useSearch("name"), useSearch("alias")];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...nameSearchState,
    },
    {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
      width: "30%",
      sorter: (a, b) => a.alias.localeCompare(b.alias),
      ...aliasSearchState,
    },
    {
      title: "Latest Commit",
      dataIndex: "latestCommit",
      width: "20%",
      key: "latestCommit",
      sorter: (a, b) => a.latestCommit.localeCompare(b.latestCommit),
    },
    {
      title: "Total Commits",
      dataIndex: "totalCommits",
      width: "20%",
      key: "totalCommits",
      sorter: (a, b) => a.totalCommits - b.totalCommits,
    },
  ];

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
        <Table
          childrenColumnName="contributorAliases"
          pagination={false}
          columns={columns}
          rowSelection={{...rowSelection}}
          dataSource={data}
        />
      </div>
    </div>
  );
}
