import { collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'
import { SubmitComment } from "./submit-comment";

export const Comment = ({ comment, prev, level, setTopComments, setColPath, db, getUserName, signInWithPopup }) => {
  const { postId } = useParams()
  const [comments, setComments] = useState()
  const [prevParams, setPrevParams] = useState(prev)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [date] = useState(comment.timeStamp ? new Date(comment.timeStamp.seconds*1000).toString() : null) // * can remove ternary in finish, but test posts dont have dates.

  const getTopComments = async(prevs) => { 
    setColPath(prevs)
  }

  useEffect(() => {
    if (!comment.commentId) {
      return
    }
    const getComments = async() => { 
      const newParams = [...prevParams, comment.commentId, 'replies']
      setPrevParams(newParams)
      const commentCollection = collection.apply(null, newParams);
      const commentSnapshot = await getDocs(commentCollection);
      const commentArr = [];
      commentSnapshot.docs.forEach(async doc => {
        const contents = doc.data()
        commentArr.push(contents)
      })
      return commentArr
    }

    const characterSetter = async() => { //rename
      try {
        setComments(await getComments())        
      } catch(error) {
        console.error(error)
      }
    }
    characterSetter()
  }, [postId, setPrevParams, comment.commentId, prev])
  return (
    <div>
      <div>{comment.username}</div> <div>{date}</div>
      <div>{comment.content}</div>
      <div onClick={() => setShowReplyBox(true)}>reply</div>
      {showReplyBox ? <SubmitComment getUserName={getUserName} signInWithPopup={signInWithPopup} dbPath={prevParams} /> : null}
      {level < 10 ? (comments && comments.length > 0 ? comments.map(comment => <Comment key={uuidv4()} getUserName={getUserName} setColPath={setColPath} setTopComments={setTopComments} level={level + 1} comment={comment} prev={prevParams} />) : null)
      :
      <button onClick={() => getTopComments(prevParams)}>Continue this thread</button>}
    </div>
  )
}