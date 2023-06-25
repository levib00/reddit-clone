import { render, screen } from '@testing-library/react';
import React from 'react';
import { Post } from '../components/post';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('post renders properly', () => {
  const generatePosts = (n) => {
    const posts = [];
    for (let i = 0; i < n; i++) {
      posts.push({uid:`name${i}`})
    }
    return posts
  }

  const post = {
    text: 'text content',
    karma: 34,
    upped: [],
    downed: [],
    title: 'Title',
    topic: 'Topic',
    userId: 'user',
    id: 'postId',
    saved: [],
    isDeleted: false,
    uid: '123'
  }

  const user = {
    currentUser: {uid : '123'}
  }
  
  test('Post content renders with text collapsed', () => {
    render(
      <MemoryRouter>
        <Post key={Math.random()} getUserName={() => user} post={post} from={'post-list'} />
      </MemoryRouter>
    );

    const title = screen.getByText('Title');
    expect(title).toBeInTheDocument();

    const karma = screen.getByText('34');
    expect(karma).toBeInTheDocument();

    const content = screen.queryByText('text content');
    expect(content).toBeNull();

    const topic = screen.queryByText('Topic');
    expect(topic).toBeInTheDocument();

    const userId = screen.queryByText('user');
    expect(userId).toBeInTheDocument();

    const date = screen.getByText('submitted', {exact: false})
    expect(date).toBeInTheDocument();
  });

  test('Post content renders with text expanded', () => {
    render(
      <MemoryRouter>
        <Post key={Math.random()} from={'post-page'} getUserName={() => user} post={post} />
      </MemoryRouter>
    );

    const title = screen.getByText('Title');
    expect(title).toBeInTheDocument();

    const karma = screen.getByText('34');
    expect(karma).toBeInTheDocument();

    const content = screen.getByText('text content');
    expect(content).toBeInTheDocument();

    const topic = screen.getByText('Topic');
    expect(topic).toBeInTheDocument();

    const userId = screen.getByText('user');
    expect(userId).toBeInTheDocument();

    const date = screen.getByText('submitted', {exact: false})
    expect(date).toBeInTheDocument();
  });

  test('collapse/expand works', () => {
    render(
      <MemoryRouter>
        <Post key={Math.random()} getUserName={() => user} post={post} from={'post-list'} />
      </MemoryRouter>
    );

    let content = screen.queryByText('text content');
    expect(content).toBeNull();

    const expand = screen.getByRole('button', {name:''})
    userEvent.click(expand)

    content = screen.getByText('text content');
    expect(content).toBeInTheDocument();

    userEvent.click(expand)

    content = screen.queryByText('text content');
    expect(content).toBeNull();
  });

  test('Pressing delete removes content and user', () => {
    render(
      <MemoryRouter>
        <Post key={Math.random()} getUserName={() => user} post={post} from={'post-page'} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByText('delete');
    userEvent.click(deleteButton)

    const confirmButton = screen.getByText('yes');
    userEvent.click(confirmButton)

    const deleted = screen.queryAllByText('[deleted]');
    expect(deleted.length).toBe(3) //checks that [deleted] shows three times, once for username, once for content.
  });

  const updateDb = jest.fn()
  const updateObj = jest.fn()

  test('Pressing upvote/downvote works', () => {
    post.upped = generatePosts(34)
    
    render(
      <MemoryRouter>
        <Post key={Math.random()} getUserName={() => user} updateObj={updateObj} updateDb={updateDb} post={post} from={'post-list'} />
      </MemoryRouter>
    );

    const karma = screen.getByText('34');
    expect(karma).toBeInTheDocument();

    const upvoteButton = screen.getByRole('button', {name: /upvote button/i});;
    userEvent.click(upvoteButton)

    const downedButton = screen.getByRole('button', {name: /downvote button/i});
    userEvent.click(downedButton)

    expect(updateDb).toBeCalledTimes(2)
    expect(updateObj).toBeCalledTimes(2)
  });

  test('Pressing save works', () => {
    post.upped = generatePosts(34)
    
    render(
      <MemoryRouter>
        <Post key={Math.random()} getUserName={() => user} updateObj={updateObj}  post={post} from={'post-list'} />
      </MemoryRouter>
    );

    const saveButton = screen.getByText('save');
    expect(saveButton).toBeInTheDocument()
    userEvent.click(saveButton)
    
    expect(updateObj).toBeCalledTimes(1)
  });
});