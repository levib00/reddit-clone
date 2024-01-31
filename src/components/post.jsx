import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  arrayRemove, arrayUnion, doc, updateDoc,
} from 'firebase/firestore';
import RelativeTime from '@yaireo/relative-time';
import SignInModal from './sign-in-prompt';

export default function Post({
  post, db, getUserName, signIn, from, updateDb, updateObj, index,
}) {
  const {
    img, title, topic, timeStamp, id, upped, downed, saved,
  } = post;

  // State variable
  const [username] = useState(getUserName());
  const [isImage, setIsImage] = useState(null);
  const [hasText, setHasText] = useState(null);
  const [thisPost, setThisPost] = useState({ ...post });
  const [expanded, setExpanded] = useState(from === 'post-page');
  const [isUpped, setIsUpped] = useState(
    username.currentUser && upped.includes(username.currentUser.uid),
  );
  const [isDowned, setIsDowned] = useState(
    downed.includes(username.currentUser && username.currentUser.uid),
  );
  const [isSaved, setIsSaved] = useState(
    saved.includes(username.currentUser && username.currentUser.uid),
  );
  const [showSignIn, setShowSignIn] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [relativeTime] = useState(new RelativeTime());

  useEffect(() => {
    setIsImage(!!img);
  }, [img]);

  useEffect(() => {
    setHasText(!!thisPost.text);
  }, [thisPost.text]);

  useEffect(() => {
    if (username.currentUser) {
      setIsSaved(thisPost.saved ? thisPost.saved.includes(username.currentUser.uid) : false);
      setIsUpped(thisPost.upped ? thisPost.upped.includes(username.currentUser.uid) : false);
      setIsDowned(thisPost.downed ? thisPost.downed.includes(username.currentUser.uid) : false);
    }
  }, [thisPost, username.currentUser]);

  // Function to update votes in the UI and database
  const updateVoteRender = (
    primaryArrName,
    primaryVoteArrCopy,
    secondaryArrName,
    secondaryVoteArrCopy,
    primaryIndex,
    secondaryIndex,
  ) => {
    if (primaryIndex < 0) {
      primaryVoteArrCopy.push(username.currentUser.uid);
      if (!(secondaryIndex < 0)) {
        secondaryVoteArrCopy.splice(secondaryIndex, 1);
      }
      updateObj(
        primaryVoteArrCopy,
        secondaryVoteArrCopy,
        primaryArrName,
        secondaryArrName,
        thisPost,
        setThisPost,
      );
    } else {
      primaryVoteArrCopy.splice(primaryIndex, 1);
      updateObj(primaryVoteArrCopy, null, primaryArrName, secondaryArrName, thisPost, setThisPost);
    }
  };

  // Function to handle voting
  const updateVote = async (
    primaryArrName,
    primaryVoteArr,
    secondaryArrName,
    secondaryVoteArr,
    newParams,
  ) => { // * this needs to be refactored and simplified.
    if (username.currentUser) {
      const primaryIndex = primaryVoteArr.indexOf(username.currentUser.uid);
      const secondaryIndex = secondaryVoteArr.indexOf(username.currentUser.uid);
      const primaryVoteArrCopy = [...primaryVoteArr];
      const secondaryVoteArrCopy = [...secondaryVoteArr];

      updateVoteRender(
        primaryArrName,
        primaryVoteArrCopy,
        secondaryArrName,
        secondaryVoteArrCopy,
        primaryIndex,
        secondaryIndex,
      );
      try {
        updateDb(
          primaryArrName,
          secondaryArrName,
          primaryVoteArrCopy,
          secondaryVoteArrCopy,
          newParams,
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowSignIn(true);
    }
  };

  // Handles pressing of a vote button
  const handleVote = async (primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr) => {
    updateVote(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr, [db, 'posts', id]);
  };

  // Function to update saves in the state to be renders
  const updateSavesRender = (savedArrName, savedArrCopy, postIndex) => {
    if (index < 0) {
      savedArrCopy.push(username.currentUser.uid);
    } else {
      savedArrCopy.splice(postIndex, 1);
    }
    updateObj(savedArrCopy, null, savedArrName, null, thisPost, setThisPost);
  };

  // Function to update saves in the database
  const updateSavesDb = async (primaryArrName, primaryVoteArrCopy, newParams) => {
    try {
      const postUpdate = await doc(...newParams);
      await updateDoc(postUpdate, {
        [primaryArrName]: primaryVoteArrCopy,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Calls functions to update saves in database and state
  const updateSaves = async (savedArrName, savedArr, newParams) => {
    if (username.currentUser) {
      const postIndex = savedArr.indexOf(username.currentUser.uid);
      const savedArrCopy = [...savedArr];

      updateSavesRender(savedArrName, savedArrCopy, postIndex);
      updateSavesDb(savedArrName, savedArrCopy, newParams);
    } else {
      setShowSignIn(true);
    }
  };

  // Adds post to users saved posts
  const savePost = async () => {
    try {
      const q = doc(db, 'saved', username.currentUser.uid);
      await updateDoc(q, {
        savedPosts: arrayUnion(doc(db, 'posts', thisPost.id)),
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Removes post from users saved posts
  const unsavePost = async () => {
    try {
      const q = doc(db, 'saved', username.currentUser.uid);
      await updateDoc(q, {
        savedPosts: arrayRemove(doc(db, 'posts', thisPost.id)),
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle saving a post
  const handleSave = (arrName, arr) => {
    savePost();
    updateSaves(arrName, arr, [db, 'posts', id]);
  };

  // Function to handle unsaving a post
  const handleUnsave = (arrName, arr) => {
    unsavePost();
    updateSaves(arrName, arr, [db, 'posts', id]);
  };

  // Function to remove a post from database
  const remove = async (postPath) => {
    try {
      const postUpdate = await doc(...postPath);
      await updateDoc(postUpdate, {
        title: '[deleted]',
        userId: '[deleted]',
        text: '[deleted]',
        isDeleted: true,
      });
    } catch (error) {
      console.error();
    }
  };

  // Function to handle removing a post from state
  const handleRemove = (postPath) => {
    remove(postPath);
    const clone = { ...thisPost };
    clone.title = '[deleted]';
    clone.userId = '[deleted]';
    clone.isDeleted = true;

    if (clone.img) {
      clone.img = '[deleted]';
    } else {
      clone.text = '[deleted]';
    }
    setThisPost(clone);
  };

  return (
    <div className={isImage ? `post${expanded ? ' expanded' : ''}` : `post text-post${expanded ? ' expanded' : ''}`}>
      {/* Render sign in prompt that shows when users
      tries an action that requires them to be signed in */}
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from="vote on a post" getUserName={getUserName} /> : null}
      {/* Render upvote/downvote buttons and karma */}
      <div className="align-left-post-column">
        <div className="post-index">{index}</div>
        <div className="voting-booth">
          <button aria-label="upvote button" className={isUpped ? 'arrow upvote upvoted' : 'arrow upvote not-upvoted'} onClick={() => handleVote('upped', thisPost.upped, 'downed', thisPost.downed)} />
          <div className="karma">{thisPost.karma}</div>
          <button aria-label="downvote button" className={isDowned ? 'arrow downvote downvoted' : 'arrow downvote not-downvoted'} onClick={() => handleVote('downed', thisPost.downed, 'upped', thisPost.upped)} />
        </div>
        {/* Render image if the post has one to render */}
        <Link to={`/reddit-clone/post/${id}`}>{ isImage ? <img className="thumbnail" src={img} alt={`${title}`} /> : <div className="thumbnail default-text" />}</Link>
      </div>
      <div className="post-top">
        {/* Render title and topic */}
        <Link to={`/reddit-clone/post/${id}`}><div className="title">{thisPost.title}</div></Link>
        <div className="post-overview">
          {' '}
          {/* Maybe move background image of below button into css backgrounds */}
          {/* Expand/Collapse button to show more or less of the posts content */}
          {(from === 'post-list' || isImage) && (isImage === true || hasText)
            ? <button aria-label="expand" className={expanded ? 'collapse expand-collapse' : `${isImage ? 'expand-image' : 'expand-text'} expand-collapse`} onClick={() => setExpanded(!expanded)} />
            : null}
          <div className="post-data">
            {/* Render post timestamp and username of poster */}
            <div className="post-info">
              <div>
                submitted
                {timeStamp ? relativeTime.from(
                  new Date(timeStamp.seconds * 1000),
                ).toString() : null}
              &nbsp;by&nbsp;
                <span className="post-username">{thisPost.userId}</span>
              &nbsp;to&nbsp;
                <Link to={`/reddit-clone/topic/${topic}`}><span className="post-topic">{topic}</span></Link>
              </div>
            </div>
            {/* Render link to comments */}
            <div className="post-actions">
              <div>
                <Link to={`/reddit-clone/post/${id}`} className="comments-button">view comments</Link>
                {' '}
                {/* // TODO: add field to thisPost that holds No. of comments,
                so it could be displayed here. would have to increment
                this with each new comment submission */}
              </div>
              {/* Render button to save/unpost post */}
              {!isSaved ? (
                <button className="save-button" onClick={() => handleSave('saved', thisPost.saved)}>
                  save
                </button>
              )
                : (
                  <button className="save-button" onClick={() => handleUnsave('saved', thisPost.saved)}>
                    unsave
                  </button>
                )}
              {/* If post is not deleted and the post belongs to the current user,
              Render delete and edit buttons */}
              {!thisPost.isDeleted && username.currentUser && (
                username.currentUser.uid === thisPost.uid
              )
                ? (
                  <div>
                    {showDeletePrompt ? (
                      <div className="confirm-delete">
                        are you sure?&nbsp;
                        <button className="delete-button" onClick={() => handleRemove([db, 'posts', id])}>yes</button>
&nbsp;/&nbsp;
                        <button className="delete-button" onClick={() => setShowDeletePrompt(!showDeletePrompt)}>no</button>
                      </div>
                    ) : <button className="delete-button" onClick={() => setShowDeletePrompt(!showDeletePrompt)}>delete</button>}
                  </div>
                )
                : null}
              {/* Shows content based on whether content is expanded/collapsed */}
            </div>
          </div>
        </div>
        <div>
          {expanded && (isImage || hasText) && (isImage ? <img className="main-post-image" src={img} alt={title} /> : <div className="post-text">{thisPost.text}</div>)}
        </div>
      </div>
    </div>
  );
}
