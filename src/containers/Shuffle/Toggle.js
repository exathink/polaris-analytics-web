import React from 'react';
import classNames from 'classnames';
import { Icon as LegacyIcon } from '@ant-design/compatible';

const Toggle = ({ clickHandler, text, icon, active, large }) => {
  const buttonClass = classNames({
    buttonToggle: true,
    noIcon: !icon,
    active,
    large,
  });
  const iconClass = `${icon}`;

  return (
    <button className={`isoControlBtn ${buttonClass}`} onClick={clickHandler}>
      <LegacyIcon type={iconClass} />
      {text}
    </button>
  );
};

export default Toggle;
