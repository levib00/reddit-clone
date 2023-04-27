import React from "react";
import { getByRole, render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { PostList } from "../components/post-list";

describe("Test post-list renders properly.", () => {
  const generatePosts = (n) => {
    const posts = [];
    for (let i = 0; i < n; i++) {
      posts.push({'title' : `This is a post ${i}`})
    }
    return posts
  }

  test('renders the correct number of posts.', () => {
    render(<PostList posts={generatePosts(25)} />);
    for (let i = 0; i < 25; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const post = screen.queryByText(`This is a post 25`);
    expect(post).toBeNull();
  });

  
})