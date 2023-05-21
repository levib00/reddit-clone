import React from "react";
import {v4 as uuidv4} from 'uuid'
import { waitFor, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { PostList } from "../components/post-list";
import {MemoryRouter} from 'react-router-dom';
import Router from 'react-router';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));
describe("Test post-list renders properly.", () => {
  const generatePosts = (n) => {
    const posts = [];
    for (let i = 0; i < n; i++) {
      posts.push({title : `This is a post ${i}`})
    }
    return posts
  }

  test('renders all posts if under page limit', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ topic: 'all' });
  
    const n = 12
    const setTopic = jest.fn()
    const postSetter = jest.fn()
    
    render(
      <MemoryRouter>
        <PostList key={uuidv4()} posts={generatePosts(n)}  setTopic={setTopic} postSetter={postSetter}/>
      </MemoryRouter>
    );
    for (let i = 0; i < n; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const post = screen.queryByText(`This is a post ${n}`);
    expect(post).toBeNull();
  });

  test('renders only max page limit even if more posts are provided.', () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ topic: 'all' });
  
    const n = 50
    const setTopic = jest.fn()
    const postSetter = jest.fn()
    
    render(
      <MemoryRouter>
        <PostList key={uuidv4()} posts={generatePosts(n)}  setTopic={setTopic} postSetter={postSetter}/>
      </MemoryRouter>
    );
    
    for (let i = 0; i < 25; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const post = screen.queryByText(`This is a post ${n - 1}`);
    expect(post).toBeNull();
  });
  
  test('pressing appropriate button on footer extends page with more posts.', async() => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ topic: 'all' });
  
    const n = 50
    const setTopic = jest.fn()
    const postSetter = jest.fn()
    
    render(
      <MemoryRouter>
        <PostList key={uuidv4()} posts={generatePosts(n)}  setTopic={setTopic} postSetter={postSetter}/>
      </MemoryRouter>
    );

    for (let i = 0; i < 25; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const extend = screen.getByText('load more posts')
    
    userEvent.click(extend)

    for (let i = 0; i < 49; i++) {
      expect(await screen.findByText(`This is a post ${i}`)).toBeInTheDocument();
    }
  });

  test('pressing appropriate button on footer loads a new page with next posts', async() => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ topic: 'all' });
  
    const n = 50
    const setTopic = jest.fn()
    const postSetter = jest.fn()
    
    render(
      <MemoryRouter>
        <PostList key={uuidv4()} posts={generatePosts(n)}  setTopic={setTopic} postSetter={postSetter}/>
      </MemoryRouter>
    );
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

  test('page numbers show when extending page', async() => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ topic: 'all' });
  
    const n = 75
    const setTopic = jest.fn()
    const postSetter = jest.fn()
    
    render(
      <MemoryRouter>
        <PostList key={uuidv4()} posts={generatePosts(n)}  setTopic={setTopic} postSetter={postSetter}/>
      </MemoryRouter>
    );

    for (let i = 0; i < 25; i++) {
      const post = screen.getByText(`This is a post ${i}`);
      expect(post).toBeInTheDocument();
    }
    const extend = screen.getByText('load more posts')
    

    for (let i = 0; i < 2; i++) {
      userEvent.click(extend)
      expect(await screen.findByText(`Page ${i}`)).toBeInTheDocument();
    }
  });
})