import ReactGA from 'react-ga';

export function initGA() {
  const trackingCode = `${process.env.REACT_APP_GA_TRACKING_CODE}`;
  if (trackingCode != null) {
    ReactGA.initialize(trackingCode);

  } else {
    console.log('No GA tracking code found: skipping initialization');
  }
}