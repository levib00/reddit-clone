import { render, screen } from '@testing-library/react';
import React from 'react';
import { Post } from '../components/post';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('renders learn react link', () => {
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
    timeStamp: {seconds: 1677557454},
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

    const date = screen.getByText('Mon Feb 27 2023 23:10:54 GMT-0500 (Eastern Standard Time)')
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

    const date = screen.getByText('Mon Feb 27 2023 23:10:54 GMT-0500 (Eastern Standard Time)')
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

  test('Pressing upvote/downvote works', () => {
    post.upped = generatePosts(34)
    
    render(
      <MemoryRouter>
        <Post key={Math.random()} getUserName={() => user} post={post} from={'post-list'} />
      </MemoryRouter>
    );

    const karma = screen.getByText('34');
    expect(karma).toBeInTheDocument();

    const upvoteButton = screen.getByText('notUpped');
    userEvent.click(upvoteButton)
    expect(screen.getByText('upped')).toBeInTheDocument();

    const uppedKarma = screen.getByText('35');
    expect(uppedKarma).toBeInTheDocument();

    const downedButton = screen.getByText('notDowned');
    userEvent.click(downedButton)
    expect(screen.getByText('downed')).toBeInTheDocument();

    const downedKarma = screen.getByText('33');
    expect(downedKarma).toBeInTheDocument();
  });

  test('Pressing save works', () => {
    post.upped = generatePosts(34)
    
    render(
      <MemoryRouter>
        <Post key={Math.random()} getUserName={() => user} post={post} from={'post-list'} />
      </MemoryRouter>
    );

    const saveButton = screen.getByText('save');
    expect(saveButton).toBeInTheDocument()
    userEvent.click(saveButton)

    const unsaveButton = screen.getByText('unsave')
    expect(unsaveButton).toBeInTheDocument()
    userEvent.click(unsaveButton)
  });
});