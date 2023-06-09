import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";

export const SubmitComment = ({getUserName, dbPath, signInWithPopup, setShowReplyBox, showReplyBox = null, comments, setComments, prevText = '', setThisComment, thisComment, isEdit = false}) => {
  const [commentInput, setCommentInput] = useState(prevText)
  const [showSignIn, setShowSignIn] = useState(false)

  const submitComment = async(newComment, commentId) => {
    await setDoc(doc.apply(null, dbPath.concat([commentId])), {
      ...newComment
    });
    if (showReplyBox !== null) {
      setShowReplyBox(!showReplyBox)
    }
  }

  const editComment = async(username, commentPath, prevUserId) => {
    if (username !== null && username.uid === prevUserId) { 
      const newComment = commentInput
      try {
        await updateDoc(commentPath, {
          content: newComment
        })
      } catch (error) {
        console.error(error)
      }
      setThisComment({...thisComment, content: newComment})
    }
  }

  const clearBox = () => {
    setCommentInput('')
  }

  const handleSubmit = async () => {
    const commentId = uuidv4()
    let username = getUserName().currentUser
    if (username !== null) {
      if (isEdit) {
        editComment(username, dbPath, thisComment.userId)
      } else {
        let newComment = {
          content: commentInput,
          karma: 0,
          timeStamp: serverTimestamp(),
          username: username.displayName,
          userId: username.uid,
          commentId: commentId,
          upped: [],
          downed: [],
          isDeleted: false
        }
        submitComment(newComment, commentId);
        setComments([...comments, newComment])
      } 
    } else {
      setShowSignIn(true)
    }
    clearBox();
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signInWithPopup={signInWithPopup} from={'submit a comment'} getUserName={getUserName} /> : null}
      <textarea onChange={(e) => setCommentInput(e.target.value)} value={commentInput}></textarea>
      <button onClick={handleSubmit}>save</button>
    </div>
  )
}