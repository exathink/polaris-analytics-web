import React from 'react';
import NavigationControls from '../../framework/navigation/components/navigationControls';
import FullscreenBtn from '../../../components/buttons/FullscreenBtn';
import './controlbar.css';

export const DashboardControlBar = () => (
    <div className='controlbar'>
      <nav className='menu' style={{width: '33%'}}>
        <NavigationControls itemClass={"menu-item"}/>
      </nav>
      <nav className='menu menu-center' style={{width: '33%'}}>
      </nav>
      <nav className='menu menu-right' style={{width: '33%'}}>
        <FullscreenBtn componentId="dashboard"/>
      </nav>
    </div>

);
