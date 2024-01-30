import {
  doc, serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SignInModal from './sign-in-prompt';

export default function SubmitComment({
  setChildComments, childComments, getUserName, dbPath, signIn, setShowReplyBox, showReplyBox = null, comments, setComments, prevText = '', setThisComment, thisComment, isEdit = false, parentId,
}) {
  // State to hold the comment input
  const [commentInput, setCommentInput] = useState(prevText);
  // State to control the display of the sign-in modal
  const [showSignIn, setShowSignIn] = useState(false);

  // Function to submit a new comment to the database
  const submitComment = async (newComment, commentId) => {
    await setDoc(doc(...dbPath.concat([commentId])), {
      ...newComment,
    });
    // Toggle the showReplyBox state if it is provided
    if (showReplyBox !== null) {
      setShowReplyBox(!showReplyBox);
    }
  };

  // Function to edit an existing comment
  const editComment = async (username, commentPath, prevUserId) => {
    if (username !== null && username.uid === prevUserId) {
      const newComment = commentInput;
      try {
        await updateDoc(doc(...commentPath), {
          content: newComment,
        });
      } catch (error) {
        console.error(error);
      }
      setThisComment({ ...thisComment, content: newComment });
    }
  };

  // Function to clear the comment input box
  const clearBox = () => {
    setCommentInput('');
  };

  // Function to handle the form submission
  const handleSubmit = async (commentParentId, commentsList) => {
    if (commentInput.length === '') {
      return;
    }
    const commentId = uuidv4();
    const username = getUserName().currentUser;
    if (username !== null) {
      if (isEdit) {
        editComment(username, dbPath.concat(thisComment.commentId), thisComment.userId);
      } else {
        const newComment = {
          content: commentInput,
          karma: 0,
          timeStamp: serverTimestamp(),
          username: username.displayName,
          userId: username.uid,
          commentId,
          upped: [],
          downed: [],
          isDeleted: false,
          parentId: commentParentId,
        };
        submitComment(newComment, commentId);
        if (!parentId) {
          setComments([newComment, ...commentsList]);
        } else {
          setChildComments([...childComments, newComment]);
        }
      }
      clearBox();
    } else {
      setShowSignIn(true);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="submit-comment">
      {/* Render the sign-in modal if showSignIn is true */}
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from="submit a comment" getUserName={getUserName} /> : null}
      {/* Textarea for entering the comment */}
      <textarea className="comment-textbox" onChange={(e) => setCommentInput(e.target.value)} value={commentInput} />
      {/* Button to save the comment */}
      <button className="submit-comment-button" onClick={() => handleSubmit(parentId, comments)}>save</button>
    </div>
  );
}
