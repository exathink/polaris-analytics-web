import React from 'react';
import { render } from 'react-testing-library';
// react-testing-library renders your components to document.body,
// this will ensure they're removed after each test.
import 'react-testing-library/cleanup-after-each';

// this adds jest-dom's custom assertions
import 'jest-dom/extend-expect';

const App = () => (
  <div>Welcome to React</div>
);

it('renders welcome message', () => {
  const { getByText } = render(<App />);
  expect(getByText('Welcome to React')).toBeInTheDocument();
});