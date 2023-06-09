import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NavBar } from "../components/nav";
import {MemoryRouter} from 'react-router-dom';
import userEvent from "@testing-library/user-event";


describe("Nav bar works properly", () => {
  const getUserName = () => {
    const currentUser = {currentUser:{displayName : 'Username'}}
    return currentUser
  }

  const signOut = jest.fn()
  const signIn = jest.fn()
  const topic = 'topic'

  test('Nav bar renders passed username', () => {
    
    render(
      <MemoryRouter>
        <NavBar getUserName={getUserName} signIn={signIn} signOut={signOut} topic={topic} isUserSignedIn={true}/>
      </MemoryRouter>
    );
    const username = screen.getByText('Username');
    expect(username).toBeInTheDocument();
  });

  test('sign in function fires.', () => {
    
    render(
      <MemoryRouter>
        <NavBar getUserName={getUserName} signIn={signIn} signOut={signOut} topic={topic} isUserSignedIn={false}/>
      </MemoryRouter>
    );
    const signInButton = screen.getByText('Sign in');
    expect(signInButton).toBeInTheDocument();
    userEvent.click(signInButton)

    expect(signIn).toBeCalledTimes(1)
  });

  test('sign out function fires.', () => {
    
    render(
      <MemoryRouter>
        <NavBar getUserName={getUserName} signIn={signIn} signOut={signOut} topic={topic} isUserSignedIn={true}/>
      </MemoryRouter>
    );
    const signOutButton = screen.getByText('Sign out');
    expect(signOutButton).toBeInTheDocument();
    userEvent.click(signOutButton)

    expect(signOut).toBeCalledTimes(1)
  });
  //test sign in
  //test sign out
})
