import React from 'react';
import { render, screen } from '@testing-library/react';
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';

const App = () => (
  <div>Welcome to React</div>
);

it('renders welcome message', () => {
  render(<App />);
  expect(screen.getByText('Welcome to React')).toBeInTheDocument();
});