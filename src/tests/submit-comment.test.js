import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SubmitComment } from '../components/submit-comment';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

describe('submit comment works properly', () => {
  test('Post content renders with text collapsed', () => {
    const getUserName = () => {
      return {currentUser: null}
    }
    render(
      <MemoryRouter>
        <SubmitComment getUserName={getUserName} setTopic={() => null}/>
      </MemoryRouter>
    );

    const textbox = screen.getByRole('textbox');
    act(() => {
      userEvent.type(textbox, 'test')
    });
    

    const saveButton = screen.getByText('save');
    expect(saveButton).toBeInTheDocument();
    act(() => {
      userEvent.click(saveButton)
    });
    

    const title = screen.getByText('Sign in to submit a comment!');
    expect(title).toBeInTheDocument();
  });
});
