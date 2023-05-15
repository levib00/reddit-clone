import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";

export const SubmitComment = ({getUserName, db, postId, isReply, signInWithPopup}) => {
  const [commentInput, setCommentInput] = useState()
  const [showSignIn, setShowSignIn] = useState(false)

  const submitPosts = async() => {
    const username = await getUserName().currentUser.displayName
    const dbPath = [db, 'posts', postId]
    // if (isReply) {dbPath.concat([pathToComment])
    if (username !== null) {
      await setDoc(doc.apply(dbPath), {
        parentId: null,
        text: commentInput,
        karma: 0,
        timeStamp: serverTimestamp(),
        userName: username,
        commentId: uuidv4(),
      });
    } else {
      setShowSignIn(true)
    }
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signInWithPopup={signInWithPopup} from={'submit a comment'} getUserName={getUserName} /> : null}
      <textarea onClick={(e) => setCommentInput(e.target.value)} value={commentInput}></textarea>
      <button onClick={submitPosts}>save</button>
    </div>
  )
}