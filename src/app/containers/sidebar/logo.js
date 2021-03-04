import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../../config.js';

const Logo = ({ collapsed }) => {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div>
          <h3>
            <Link to={siteConfig.homePath}>
              <i className={siteConfig.siteIcon} />
            </Link>
          </h3>
        </div>
      ) : (
        <h3>
          <Link to={siteConfig.homePath}>{siteConfig.siteName}</Link>
        </h3>
      )}
    </div>
  );
};

export default Logo;
