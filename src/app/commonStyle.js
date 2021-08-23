import styled from 'styled-components';
import {palette} from 'styled-theme';

const AppHolder = styled.div`
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 16px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: ${palette('primary', 0)};
  }

  .ant-layout-sider-collapsed .anticon {
    font-size: 16px;
  }

  .ant-layout-sider-collapsed .nav-text {
    display: none;
  }

  .ant-layout {
    background: ${palette('secondary', 1)};

    &.isoContentMainLayout {
      overflow: auto;
      overflow-x: hidden;
      @media only screen and (min-width: 768px) and (max-width: 1220px) {
        width: calc(100% - 64px);
        flex-shrink: 0;
      }

      @media only screen and (max-width: 767px) {
        width: 100%;
        flex-shrink: 0;
      }
    }
  }

  .ant-radio-button-wrapper {
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
  }

  .ant-steps-item-title:after {
    top: 10px;
    height: 2px;
    background-color: #CACACA;
  }

  .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
      background-color: #1A2842;
    }
    .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
        background-color: #cacaca;
    }
    .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
        background-color: #cacaca;
    }

  .ant-steps {
    .ant-steps-item-title,
    .ant-steps-item-icon {
      font-size: 12px;
      line-height: 14px;
      top: 7px;
      @media only screen and (min-width: 768px) {
        font-size: 13px;
        line-height: 16px;
      }
      @media only screen and (min-width: 992px) {
        font-size: 14px;
        line-height: 17px;
      }
      @media only screen and (min-width: 1200px) {
        font-size: 16px;
        line-height: 19px;
      }
    }
    .ant-steps-item-icon {
      width: 21px;
      height: 21px;
      line-height: 21px;
      @media only screen and (min-width: 768px) {
        width: 25px;
        height: 25px;
        line-height: 25px;
      }
      @media only screen and (min-width: 992px) {
        width: 29px;
        height: 29px;
        line-height: 29px;
      }
      @media only screen and (min-width: 1200px) {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .isoLayoutContent {
    width: 100%;
    padding: 35px;
    background-color: #ffffff;
    border: 1px solid ${palette('border', 0)};
    height: 100%;
  }

  .isomorphicLayout {
    width: calc(100% - 240px);
    flex-shrink: 0;
    overflow-x: hidden !important;

    @media only screen and (max-width: 767px) {
      width: 100%;
    }

    @media only screen and (min-width: 768px) and (max-width: 1220px) {
      width: calc(100% - 64px);
    }
  }

  .ant-layout-footer {
    font-size: 13px;
    @media (max-width: 767px) {
      padding: 10px 20px;
    }
  }

  button {
    border-radius: 0;
  }

  .app-content-wrapper {
    width: 100%;
    height: 100%;
    padding: 0;
    background: #f1f3f6;
  }

  .app-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  a {
      color: ${palette('text', 0)};

      &:hover {
      color: ${palette('primary', 0)};
      }
    }
`;

export default AppHolder;
