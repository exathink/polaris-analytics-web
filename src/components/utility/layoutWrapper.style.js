import styled from 'styled-components';

const LayoutContentWrapper = styled.div`
  padding: 0; 
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;

  @media only screen and (max-width: 767px) {
    padding: 0;
  }

  @media (max-width: 580px) {
    padding: 0;
  }
`;

export { LayoutContentWrapper };
