import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'
import { SubmitComment } from "./submit-comment";

export const Comment = ({ comment, prev, level, setTopComments, setColPath, db, getUserName, signInWithPopup }) => {
  const { postId } = useParams()
  const [thisComment, setThisComment] = useState({...comment})
  const [childComments, setChildComments] = useState()
  const [prevParams, setPrevParams] = useState([...prev, comment.commentId, 'replies'])
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [showEditBox, setShowEditBox] = useState(false)
  const [date] = useState(comment.timeStamp.seconds ? new Date(comment.timeStamp.seconds*1000).toString() : new Date(Date.now()).toString())
  const [username] = useState(getUserName())
  const [isUpped, setIsUpped] = useState(thisComment.upped ? thisComment.upped.includes(username.currentUser.uid) : false)
  const [isDowned, setIsDowned] = useState(thisComment.downed ? thisComment.downed.includes(username.currentUser.uid) : false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)

  useEffect(() => {
    setIsUpped(thisComment.upped ? thisComment.upped.includes(username.currentUser.uid) : false)
    setIsDowned(thisComment.downed ? thisComment.downed.includes(username.currentUser.uid) : false)
  }, [thisComment, username.currentUser.uid])


  const updatePosts = (newVote, newOtherVote = null, voteArr, otherArr) => {
    const clone = {...thisComment}
    clone[voteArr] = newVote

    if (newOtherVote !== null) {
      clone[otherArr] = newOtherVote
    }
    clone.karma = clone.upped.length - clone.downed.length
    setThisComment(clone)
  }

  const updateVote = async(voteArr, vote, otherArr, otherVote, newParams) => { // * this needs to be refactored and simplified.
    if (username.currentUser) {
      const postUpdate = await doc.apply(null, newParams)
      const index = vote.indexOf(username.currentUser.uid)
      const otherIndex = otherVote.indexOf(username.currentUser.uid)
      const newOtherVote = [...otherVote]
      if (index < 0) {
        const newVote = [...vote, username.currentUser.uid]
        await updateDoc(postUpdate, {
          [voteArr]: newVote,
          karma: newVote.length - newOtherVote.length
        }); // might be able to refactor this out with the else.
        if (!(otherIndex < 0)) {
          newOtherVote.splice(otherIndex, 1)
          await updateDoc(postUpdate, {
            [otherArr]: newOtherVote,
            karma: newVote.length - newOtherVote.length
          });
        }
        updatePosts(newVote, newOtherVote, voteArr, otherArr, thisComment)
      } else {
        const newVote = [...vote]
        newVote.splice(index, 1)
        await updateDoc(postUpdate, {
          [voteArr]: newVote,
          karma: newVote.length - newOtherVote.length
        })
        updatePosts(newVote, null, voteArr, otherArr, thisComment)
      }
    } else {
      //setShowSignIn(true)
    }
  }

  const handleVote = async(voteArr, vote, otherArr, otherVote) => {
    const newParams = prevParams.slice(0, prevParams.length - 1)
    updateVote(voteArr, vote, otherArr, otherVote, newParams)
  }

  const remove = async(postPath) => {
    const postUpdate = await doc.apply(null, postPath.slice(0, postPath.length - 1))
    await updateDoc(postUpdate, {
      content: '[deleted]',
      username: '[deleted]',
      isDeleted: true,
    })
  }

  const edit = async () => {
    setShowEditBox(!showEditBox)
  }

  const getTopComments = async(prevs) => { 
    setColPath(prevs)
  }

  useEffect(() => {
    if (!comment.commentId) {
      return
    }
    const getComments = async() => { 
      const commentCollection = collection.apply(null, prevParams);
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
        setChildComments(await getComments())        
      } catch(error) {
        console.error(error)
      }
    }
    characterSetter()
  }, [postId, setPrevParams, comment.commentId, prev, showReplyBox])

  return (
    <div>
      <>
        <button onClick={() => handleVote('upped', thisComment.upped, 'downed', thisComment.downed )}>{isUpped ? 'upped' : 'notUpped'}</button>
        <button onClick={() => handleVote('downed', thisComment.downed, 'upped', thisComment.upped)}>{isDowned ? 'Downed' : 'notDowned'}</button>
      </>
      <div>{thisComment.username}</div> <div>{thisComment.karma}</div> <div>{date}</div>
      <div>{thisComment.content}</div>
      <div>
        <div onClick={() => setShowReplyBox(!showReplyBox)}>reply</div>
        {!thisComment.isDeleted && username.currentUser.uid === comment.userId ? /* only show if getUsername.currentUser.uid === comment.userId */
        
        <div>
          {showDeletePrompt ? <div>are you sure? <div onClick={() => remove(prevParams)}>yes</div> / <div onClick={() => setShowDeletePrompt(!showDeletePrompt)}>no</div></div> : <div onClick={() => setShowDeletePrompt(!showDeletePrompt)}>delete</div>}
          <div onClick={() => edit()}>edit</div>
        </div>
        : 
        null
        }
      </div>
      {showEditBox ? <SubmitComment thisComment={thisComment} setThisComment={setThisComment} isEdit={true} prevText={thisComment.content} showReplyBox={showReplyBox} setShowReplyBox={setShowReplyBox} getUserName={getUserName} signInWithPopup={signInWithPopup} dbPath={prevParams} /> : null}
      {showReplyBox ? <SubmitComment showReplyBox={showReplyBox} setShowReplyBox={setShowReplyBox} getUserName={getUserName} signInWithPopup={signInWithPopup} dbPath={prevParams} /> : null}
      {level < 10 ? (childComments && childComments.length > 0 ? childComments.map(comment => <Comment key={uuidv4()}  getUserName={getUserName} setColPath={setColPath} setTopComments={setTopComments} level={level + 1} comment={comment} prev={prevParams} />) : null)
      :
      <button onClick={() => getTopComments(prevParams)}>Continue this thread</button>}
    </div>
  )
}
