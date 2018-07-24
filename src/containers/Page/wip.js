import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../image/idea-execute.png';
import IntlMessages from '../../components/utility/intlMessages';
import WipStyleWrapper from './wip.style';

export class Wip extends React.Component {
  render() {
    return (
      <WipStyleWrapper className="iso404Page">
        <div className="iso404Content">
          <h1>
            <IntlMessages id="pageWip.title" />
          </h1>
          <h3>
            <IntlMessages id="pageWip.subTitle" />
          </h3>
          <p>
            <IntlMessages id="pageWip.description" />
          </p>
          <button type="button">
            <Link to="/">
              <IntlMessages id="pageWip.backButton" />
            </Link>
          </button>
        </div>

        <div className="iso404Artwork">
          <img alt="#" src={Image} />
        </div>
      </WipStyleWrapper>
    );
  }
}

export default Wip;
