import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../image/rob.png';
import {FormattedMessage} from 'react-intl';
import FiveZeroZeroStyleWrapper from './500.style';

export class FiveHundred extends React.Component {
  render() {
    return (
      <FiveZeroZeroStyleWrapper className="iso500Page">
        <div className="iso500Content">
          <h1>
            <FormattedMessage id="page500.title" />
          </h1>
          <h3>
            <FormattedMessage id="page500.subTitle" />
          </h3>
          <p>
            <FormattedMessage id="page500.description" />
          </p>
          <button type="button">
            <Link to="/">
              <FormattedMessage id="page500.backButton" />
            </Link>
          </button>
        </div>

        <div className="iso500Artwork">
          <img alt="#" src={Image} />
        </div>
      </FiveZeroZeroStyleWrapper>
    );
  }
}

export default FiveHundred;
