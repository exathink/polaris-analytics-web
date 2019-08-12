import {Table} from 'antd';
import {CompactStyle} from './styles/table.style';
import WithDirection from '../../config/withDirection';

const isoTable = WithDirection(Table);
const CompactTable = CompactStyle(Table);
const isoCompactTable = WithDirection(CompactTable);

export {Table, CompactTable, isoTable, isoCompactTable};
