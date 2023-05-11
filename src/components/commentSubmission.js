import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'

export const SubmitComment = ({getUserName, db, postId, isReply}) => {
  const [commentInput, setCommentInput] = useState()

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
      return // put some text above the form that says please sign in to submit a post. maybe do signInPopup
    }
  }

  return (
    <div>
      <textarea onClick={(e) => setCommentInput(e.target.value)} value={commentInput}></textarea>
      <button onClick={submitPosts}>save</button>
    </div>
  )
}