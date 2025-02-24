import React from 'react';
import {FormattedMessage} from 'react-intl';

export default ({ config, changeTheme, selectedId }) => {
  const { id, label, options } = config;
  return (
    <div className="themeSwitchBlock">
      <h4>
        <FormattedMessage id={label} />
      </h4>
      <div className="themeSwitchBtnWrapper">
        {options.map(option => {
          const { themeName, buttonColor } = option;
          const onClick = () => {
            changeTheme(id, themeName);
          };
          const customClass = themeName === selectedId ? 'selectedTheme' : '';
          return (
            <button
              type="button"
              key={themeName}
              onClick={onClick}
              className={customClass}
              style={{ backgroundColor: buttonColor }}
            />
          );
        })}
      </div>
    </div>
  );
};
