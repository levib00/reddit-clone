import { render, screen } from '@testing-library/react';
import React from 'react';
import { SignInModal } from '../components/sign-in-prompt';
import { MemoryRouter } from 'react-router-dom';

test('renders learn react link', () => {
  render(
    <MemoryRouter>
      <SignInModal  from={'test passes'} />
    </MemoryRouter>
  );
  const from = screen.getByText('Sign in to test passes')
  expect(from).toBeInTheDocument()
});