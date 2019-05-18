import React from 'react';
import {Table} from 'antd';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {Tag, Icon, Divider} from 'antd';

import {AddAccountForm} from "./addAccountForm";
import {AllAccountsTable} from "./allAccountsTable";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <Icon type="mail" theme="twoTone" title={`Invite ${record.name}`}/>
        <Divider type="vertical"/>
        <Icon type="delete" theme="twoTone" title={'Delete'}/>
      </span>
    ),
  },
];

const data = []
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  })
}
;


export default class extends React.Component {
  render() {
    return (
      <Dashboard h={"100%"}>
        <DashboardRow
          title={"All Accounts"}
          controls={[
            () =>
              <AddAccountForm/>
          ]}
        >
          <DashboardWidget
            name={'table'}
            w={1}
            showDetail={true}
            render={() => <AllAccountsTable/>}
          />
        </DashboardRow>
      </Dashboard>
    );
  }
}




