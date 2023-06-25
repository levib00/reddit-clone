import { render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { Comment } from '../components/comment';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';


describe("Test comments render properly.", () => {
  const getUserName = () => {
    return {currentUser: {uid: 'uid'}}
  }

  const comment = {
    content: 'comment content',
    karma: 34,
    timeStamp: {seconds: 1677557454},
    username: 'user',
    userId: 'uid',
    commentId: 123456,
    upped: [],
    downed: [],
    isDeleted: false
  }

  const generatePosts = (n) => {
    const posts = [];
    for (let i = 0; i < n; i++) {
      posts.push({title : `This is a post ${i}`, upped: 'none', downed: 'none', saved:'none'})
    }
    return posts
  }

  test('Comment content renders', () => {
    render(
      <MemoryRouter>
        <Comment key={Math.random()} level={0} getUserName={getUserName} postId={null} signInWithPopup={null} comment={comment} db={null} prev={[null, 'posts', null, 'comments']}/>
      </MemoryRouter>
    );

    const username = screen.getByText('user');
    expect(username).toBeInTheDocument();
    const karma = screen.getByText('34 points');
    expect(karma).toBeInTheDocument();
    const content = screen.getByText('comment content');
    expect(content).toBeInTheDocument();
    const date = screen.getByText('ago', {exact: false})
    expect(date).toBeInTheDocument()
    
  });

  test('Pressing reply will add SubmitComment component', () => {
    render(
      <MemoryRouter>
        <Comment key={Math.random()} level={0} getUserName={getUserName} postId={null} signInWithPopup={null} comment={comment} db={null} prev={[null, 'posts', null, 'comments']}/>
      </MemoryRouter>
    );

    const replyButton = screen.getByText('reply');
    userEvent.click(replyButton)
    const submitReplyButton = screen.getByText('save')
    expect(submitReplyButton).toBeInTheDocument()
  });
  
  const updateDb = jest.fn()
  const updateObj = jest.fn()

  test('Pressing upvote/downvote works', () => {
    comment.upped = generatePosts(34)
    render(
      <MemoryRouter>
        <Comment key={Math.random()} level={0} getUserName={getUserName} updateObj={updateObj} updateDb={updateDb} postId={null} signInWithPopup={null} comment={comment} db={null} prev={[null, 'posts', null, 'comments']}/>
      </MemoryRouter>
    );

    const karma = screen.getByText('34 points');
    expect(karma).toBeInTheDocument();

    const upvoteButton = screen.getByRole('button', {name: /upvote button/i});
    userEvent.click(upvoteButton)


    const downedButton = screen.getByRole('button', {name: /downvote button/i});
    userEvent.click(downedButton)
    
    expect(updateDb).toBeCalledTimes(2)
    expect(updateObj).toBeCalledTimes(2)
  });

  test('Pressing delete removes content and user', () => {
    render(
      <MemoryRouter>
        <Comment key={Math.random()} level={0} getUserName={getUserName} postId={null} signInWithPopup={null} comment={comment} db={null} prev={[null, 'posts', null, 'comments']}/>
      </MemoryRouter>
    );

    const deleteButton = screen.getByText('delete');
    userEvent.click(deleteButton)

    const confirmButton = screen.getByText('yes');
    userEvent.click(confirmButton)

    const deleted = screen.queryAllByText('[deleted]');
    expect(deleted.length).toBe(2) //checks that [deleted] shows twice, once for username, once for content.
  });

  test('Editing comments works', () => {
    render(
      <MemoryRouter>
        <Comment key={Math.random()} level={0} getUserName={getUserName} postId={null} signInWithPopup={null} comment={comment} db={null} prev={[null, 'posts', null, 'comments']}/>
      </MemoryRouter>
    );

    const editButton = screen.getByText('edit');
    userEvent.click(editButton)

    const textbox = screen.getByRole('textbox');
    userEvent.click(textbox)
    userEvent.type(textbox, ' also this')

    const saveButton = screen.getByText('save')
    userEvent.click(saveButton)

    const newComment = screen.queryByText('comment content also this');
    expect(newComment).toBeInTheDocument() 
  });
})
