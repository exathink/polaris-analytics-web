import styled from 'styled-components';
import { palette } from 'styled-theme';
import { boxShadow } from '../../../config/style-util';
import WithDirection from '../../../config/withDirection';

const WDSingleCardWrapper = styled.li`
  padding: 15px;
  background-color: #ffffff;
  position: relative;
  margin-bottom: 5px;
  ${boxShadow('0 0 1px rgba(0,0,0,0.15)')};

  .isoCardImage {
    overflow: hidden;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    background-color: ${palette('grayscale', 6)};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .isoCardContent {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 15px;

    .isoCardTitle {
      font-size: 18px;
      font-weight: 500;
      color: ${palette('text', 0)};
      margin: 0 0 3px;
      text-transform: capitalize;
    }

    .isoCardDate {
      font-size: 12px;
      font-weight: 400;
      color: ${palette('grayscale', 0)};
    }
    
    a {
      color: ${palette('text', 0)};
      
      &:hover {
      color: ${palette('primary', 0)};
      }
    }
  }

 
  &.grid {
    width: calc(100% / 3 - 15px);
    display: flex;
    flex-direction: column;
    margin: 0 7px 15px;
    padding: 0;

    @media only screen and (max-width: 767px) {
      width: calc(100% / 2 - 10px);
      margin: 0 5px 10px;
    }

    @media only screen and (max-width: 480px) {
      width: 100%;
      margin-right: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
      margin-left: ${props => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
    }

    @media only screen and (min-width: 1400px) {
      width: calc(100% / 4 - 15px);
      margin: 0 7px 15px;
    }

    .isoCardImage {
      width: 100%;
      height: 260px;
      display: flex;

      @media only screen and (min-width: 960px) {
        height: 330px;
      }
      i {
        font-size: 200px;
        color: ${palette('secondary', 4)};
            
      }
    }

    .isoCardContent {
      padding: 15px;
      margin: 0;
    }
  }
`;

const WDNavGridWrapper = styled.div`
  padding: 10px 35px;

  @media only screen and (max-width: 767px) {
    padding: 30px 20px;
  }

  
  &.grid {
    .navItemsContainer {
      ul {
        width: 100%;
        
        overflow-y: auto;
        display: flex;
        flex-flow: row wrap;
      }
    }
  }
`;
const SingleCardWrapper = WithDirection(WDSingleCardWrapper);
const NavGridWrapper = WithDirection(WDNavGridWrapper);

export { SingleCardWrapper, NavGridWrapper };
