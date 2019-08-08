import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntRadiobox = ComponentName => styled(ComponentName)`
  &.ant-radio-wrapper,
  .ant-radio-wrapper {
    color: ${palette('text', 1)};
    font-size: 11px;
    @media only screen and (min-width: 768px) {
      font-size: 12px;
    }
    @media only screen and (min-width: 992px) {
      font-size: 13px;
    }
    @media only screen and (min-width: 1200px) {
      font-size: 14px;
    }

    .ant-radio-inner {
      &:after {
        width: 6px;
        height: 6px;
        top: 4px;
        left: 4px;
        background-color: ${palette('primary', 0)};
      }
    }

    .ant-radio-checked .ant-radio-inner,
    .ant-radio-indeterminate .ant-radio-inner {
      border-color: ${palette('primary', 0)};
    }

    .ant-radio:hover .ant-radio-inner,
    .ant-radio-input:focus + .ant-radio-inner {
      border-color: ${palette('primary', 0)};
    }

    .ant-radio-disabled .ant-radio-inner:after {
      background-color: #ccc;
    }

    &:hover {
      .ant-radio-inner {
        border-color: ${palette('primary', 0)};
      }
    }

    .ant-radio-checked {
      .ant-radio-inner {
        &:after {
          transform: scale(1);
        }
      }
    }
  }
`;

export default AntRadiobox;
