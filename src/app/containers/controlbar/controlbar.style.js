import styled from 'styled-components';

export const ControlbarWrapper = styled.div`
  .dashboard-controls {
  width: 100%;
  height: 3%;
  display: flex;
  flex-direction: row;
  background: #2d3446;
  padding: 0px 0.5%;
  font-size: 1.5rem;
}

.dashboard-controls .menu {
  height: 100%;
  display: flex;
  align-items: center;
}

.dashboard-controls .menu-right {
  flex-direction: row-reverse;
}

.dashboard-controls .menu-center {
  flex-direction: row;
  justify-content: center;
}


.dashboard-controls .menu-item {
  font-size: 18px;
  vertical-align: text-top;
  margin: 10px;
  cursor: pointer;
  color: #fff
}

.dashboard-controls .menu-item.disabled {
  font-size: 18px;
  vertical-align: text-top;
  margin: 10px;
  color: #979797;
  cursor: default;
}
`;