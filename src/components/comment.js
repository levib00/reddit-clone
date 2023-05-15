import { collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'

export const Comment = ({ comment, prev, level, setTopComments, setColPath }) => {
  const { postId } = useParams()
  const [comments, setComments] = useState()
  const [prevParams, setPrevParams] = useState(prev)

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
      // Gets coordinates for character chosen from dropdown.
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
      <div>{comment.username}</div> <div>{comment.timeStamp}</div>
      <div>{comment.content}</div>
      {level < 10 ? (comments && comments.length > 0 ? comments.map(comment => <Comment key={uuidv4()} setColPath={setColPath} setTopComments={setTopComments} level={level + 1} comment={comment} prev={prevParams} />) : null)
      :
      <button onClick={() => getTopComments(prevParams)}>Continue this thread</button>}
    </div>
  )
}