import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Post } from '../components/post';

describe("Test post-page renders properly.", () => {
  const post = {uid:'name1', upped:[], downed:[], saved:[], title:'title test', topic:'topic test', timeStamp:{seconds:1677557454}, id:'postId', userId:'user'}

  const getUserName = () => {
    return {currentUser:{displayName: 'user'}} 
  }

  test('renders learn react link', () => {
    render(
      <MemoryRouter>
        <Post key={Math.random()} post={post} getUserName={getUserName} from={'post-page'} />
      </MemoryRouter>
    );
    
    const username = screen.getByText('user')
    expect(username).toBeInTheDocument()

    const title = screen.getByText('title test')
    expect(title).toBeInTheDocument()

    const topic = screen.getByText('topic test')
    expect(topic).toBeInTheDocument()

    const date = screen.getByText('ago', {exact: false})
    expect(date).toBeInTheDocument()
  });
})