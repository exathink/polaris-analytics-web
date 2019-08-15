import {Table} from 'antd';
import {CompactStyle} from './table.style';

const CompactTable = CompactStyle(Table);
CompactTable.Column = Table.Column

export {Table, CompactTable};
