import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game header and status', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/Game Status/i)).toBeInTheDocument();
});
