import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NavBar } from "../components/nav";
import {MemoryRouter} from 'react-router-dom';


describe("Test nav bar renders properly", () => {
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
        <NavBar getUserName={getUserName} signIn={signIn} signOut={signOut} topic={topic} />
      </MemoryRouter>
    );
    const username = screen.getByText('Username');
    expect(username).toBeInTheDocument();
  });

  test('sign in/out functions fire.', () => {
    
    render(
      <MemoryRouter>
        <NavBar getUserName={getUserName} signIn={signIn} signOut={signOut} topic={topic} />
      </MemoryRouter>
    );
    const username = screen.getByText('Username');
    expect(username).toBeInTheDocument();
  });
  //test sign in
  //test sign out
})
