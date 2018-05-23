import styled from 'styled-components';
import { borderRadius } from '../../../../config/style-util';

const StickerWidgetWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: auto;
  ${borderRadius('1px')};

  .isoIconWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    flex-shrink: 0;
    background-color: rgba(0, 0, 0, 0.1);

    i {
      font-size: 30px;
    }
  }

  .isoContentWrapper {
    width: 100%;
    display: flex;
    padding: 1px;
    align-items: flex-start;
    flex-direction: row;

    
    .isoStatNumber {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.1;
      margin: 0 0 5px;
    }

    .isoLabel {
      font-size: 16px;
      font-weight: 400;
      margin: 0;
      line-height: 1.2;
    }
  }
`;

export { StickerWidgetWrapper };
