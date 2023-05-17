import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";

export const SubmitComment = ({getUserName, dbPath, signInWithPopup, setShowReplyBox, showReplyBox}) => {
  const [commentInput, setCommentInput] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)

  const submitComment = async() => {// rename
    const commentId = uuidv4()
    const username = await getUserName().currentUser.displayName
    if (username !== null) {
      await setDoc(doc.apply(null, dbPath.concat(commentId)), {
        content: commentInput,
        karma: 0,
        timeStamp: serverTimestamp(),
        userName: username,
        commentId: commentId,
      });
    } else {
      setShowSignIn(true)
    }
    setShowReplyBox(!showReplyBox)
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signInWithPopup={signInWithPopup} from={'submit a comment'} getUserName={getUserName} /> : null}
      <textarea onChange={(e) => setCommentInput(e.target.value)} value={commentInput}></textarea>
      <button onClick={submitComment}>save</button>
    </div>
  )
}