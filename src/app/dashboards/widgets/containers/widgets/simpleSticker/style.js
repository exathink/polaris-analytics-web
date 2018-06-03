import styled from 'styled-components';
import { borderRadius } from '../../../../../../config/style-util';

const StickerWidgetWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  ${borderRadius('5px')};

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
    justify-content: center;
    padding-left: 5px;
    display: flex;
    flex-direction: column;

    .isoStatNumber {
      font-size: 2.5vh;
      font-weight: 500;
      line-height: 1.1;
      margin: 0 0 5px;
    }

    .isoLabel {
      font-size: 2vh;
      font-weight: 400;
      margin: 0;
      line-height: 1.2;
    }
  }
`;

export { StickerWidgetWrapper };
