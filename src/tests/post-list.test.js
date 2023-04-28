import React from "react";
import { waitFor, render, screen } from "@testing-library/react";
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

  test('renders all posts if under page limit', () => {
    const n = 12
    render(<PostList posts={generatePosts(n)} />);
    for (let i = 0; i < n; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const post = screen.queryByText(`This is a post ${n}`);
    expect(post).toBeNull();
  });

  test('renders only max page limit even if more posts are provided.', () => {
    const n = 50
    render(<PostList posts={generatePosts(n)} />);
    for (let i = 0; i < 25; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const post = screen.queryByText(`This is a post ${n - 1}`);
    expect(post).toBeNull();
  });
  
  test('pressing appropriate button on footer extends page with more posts.', async() => {
    const n = 50
    render(<PostList posts={generatePosts(n)} />);
    for (let i = 0; i < 25; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const extend = screen.getByText('load more posts')
    
    userEvent.click(extend)

    for (let i = 0; i < n; i++) {
      expect(await screen.findByText(`This is a post ${i}`)).toBeInTheDocument();
    }
  });

  test('pressing appropriate button on footer loads a new page with next posts', async() => {
    const n = 50
    render(<PostList posts={generatePosts(n)} />);
    for (let i = 0; i < 25; i++) {
      const post = await screen.findByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const loadNext = screen.getByText('load the next page')

    userEvent.click(loadNext)

    for (let i = 25; i < n; i++) {
      const post = await screen.findByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const post = screen.queryByText(`This is a post ${1}`);
    await waitFor(() => {
      expect(post).not.toBeInTheDocument();
    });
  });
})