import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";

export const SubmitComment = ({getUserName, dbPath, signInWithPopup, setShowReplyBox, showReplyBox = null, comments, setComments}) => {
  const [commentInput, setCommentInput] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)

  const submitComment = async(newComment, username, commentId) => {
    if (username !== null) {
      await setDoc(doc.apply(null, dbPath.concat([commentId])), {
        ...newComment
      });
    } else {
      setShowSignIn(true)
    }
    if (showReplyBox !== null) {
      setShowReplyBox(!showReplyBox)
    }
  }

  const clearBox = () => {
    setCommentInput('')
  }

  const handleSubmit = async () => {
    const commentId = uuidv4()
    const username = await getUserName().currentUser.displayName
    const newComment = {
      content: commentInput,
      karma: 0,
      timeStamp: serverTimestamp(),
      username: username,
      commentId: commentId,
      upped: [],
      downed: [],
    }
    console.log(serverTimestamp())
    submitComment(newComment, username, commentId);
    setComments([...comments, newComment])
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