import React from "react";
import { getByRole, render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { NavBar } from "../components/nav";


describe("Test nav bar renders properly", () => {
  test('Nav bar renders passed username', () => {
    render(<NavBar username={'Username'} />);
    const username = screen.getByText('Username');
    expect(username).toBeInTheDocument();
  });
})
