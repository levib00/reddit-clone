import { doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'
import { SubmitComment } from "./submit-comment";
import { SignInModal } from "./sign-in-prompt";

export const Comment = ({ comment, getComments ,prev, level, setTopComments, setColPath, getUserName, signIn }) => {
  const { postId } = useParams()

  const [thisComment, setThisComment] = useState({...comment})
  const [childComments, setChildComments] = useState()
  const [prevParams, setPrevParams] = useState([...prev, comment.commentId, 'replies'])
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [showEditBox, setShowEditBox] = useState(false)
  const [date] = useState(comment.timeStamp.seconds ? new Date(comment.timeStamp.seconds*1000).toString() : new Date(Date.now()).toString())
  const [username] = useState(getUserName())
  const [isUpped, setIsUpped] = useState(username.currentUser && thisComment.upped ? thisComment.upped.includes(username.currentUser.uid) : false)
  const [isDowned, setIsDowned] = useState(username.currentUser && thisComment.downed ? thisComment.downed.includes(username.currentUser.uid) : false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)

  useEffect(() => {
    if (username.currentUser) {
      setIsUpped(thisComment.upped ? thisComment.upped.includes(username.currentUser.uid) : false)
      setIsDowned(thisComment.downed ? thisComment.downed.includes(username.currentUser.uid) : false)
    }
  }, [thisComment, username.currentUser])

  useEffect(() => {
    if (!comment.commentId) {
      return
    }
    const childCommentSetter = async() => {
      try {
        setChildComments(await getComments())        
      } catch(error) {
        console.error(error)
      }
    }
    childCommentSetter()
  }, [postId, setPrevParams, comment.commentId, prev, showReplyBox])

  const updatePosts = (primaryVoteArrCopy, secondaryVoteArrCopy = null, primaryArrName, secondaryArrName) => {
    const clone = {...thisComment}
    clone[primaryArrName] = primaryVoteArrCopy

    if (secondaryVoteArrCopy !== null) {
      clone[secondaryArrName] = secondaryVoteArrCopy
    }
    
    clone.karma = clone.upped.length - clone.downed.length
    setThisComment(clone)
  }

  const updateDb = async(primaryArrName, secondaryArrName, primaryVoteArrCopy, secondaryVoteArrCopy, newParams) => {
    if (primaryArrName === 'upped') {
      try {
        const postUpdate = await doc.apply(null, newParams)
        await updateDoc(postUpdate, {
          [primaryArrName]: primaryVoteArrCopy,
          [secondaryArrName]: secondaryVoteArrCopy,
          karma: primaryVoteArrCopy.length - secondaryVoteArrCopy.length
        });
      } catch(error) {
        console.error(error)
      }
    } else {
      try {
        const postUpdate = await doc.apply(null, newParams)
        await updateDoc(postUpdate, {
          [primaryArrName]: primaryVoteArrCopy,
          [secondaryArrName]: secondaryVoteArrCopy,
          karma: secondaryVoteArrCopy.length - primaryVoteArrCopy.length
        });
      } catch(error) {
        console.error(error)
      }
    }
  }

  const updateRender = (primaryVoteArrCopy, primaryArrName, secondaryVoteArrCopy, secondaryArrName, primaryIndex, secondaryIndex) => {
    if (primaryIndex < 0) {
      primaryVoteArrCopy.push(username.currentUser.uid)
      if (!(secondaryIndex < 0)) {
        secondaryVoteArrCopy.splice(secondaryIndex, 1)
      }
      updatePosts(primaryVoteArrCopy, secondaryVoteArrCopy, primaryArrName, secondaryArrName, thisComment)
    } else {
      primaryVoteArrCopy.splice(primaryIndex, 1)
      updatePosts(primaryVoteArrCopy, null, primaryArrName, secondaryArrName, thisComment)
    }
  }

  const updateVote = async(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr, newParams) => {
    if (username.currentUser) {
      const primaryIndex = primaryVoteArr.indexOf(username.currentUser.uid)
      const secondaryIndex = secondaryVoteArr.indexOf(username.currentUser.uid)
      const primaryVoteArrCopy = [...primaryVoteArr]
      const secondaryVoteArrCopy = [...secondaryVoteArr]
      
      updateRender(primaryVoteArrCopy, primaryArrName, secondaryVoteArrCopy, secondaryArrName, primaryIndex, secondaryIndex)
      updateDb(primaryVoteArrCopy, primaryArrName, secondaryVoteArrCopy, secondaryArrName, newParams)
    } else {
      setShowSignIn(true)
    }
  }

  const handleVote = async(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr) => {
    const newParams = prevParams.slice(0, prevParams.length - 1)
    updateVote(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr, newParams)
  }

  const remove = async(postPath) => {
    try {
      const postUpdate = await doc.apply(null, postPath.slice(0, postPath.length - 1))
      await updateDoc(postUpdate, {
      content: '[deleted]',
      username: '[deleted]',
      isDeleted: true,
    })
    } catch (error) {
      console.error(error)
    }
  }

  const handleRemove = (prevParams) => {
    remove(prevParams)
    const clone = {...thisComment}
    clone.content = '[deleted]'
    clone.username = '[deleted]'
    clone.isDeleted = true
    setThisComment(clone)
  }

  const edit = async () => {
    setShowEditBox(!showEditBox)
  }

  const getTopComments = async(prevs) => { 
    setColPath(prevs)
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from={'submit a comment'} getUserName={getUserName} /> : null}
      <>
        <button onClick={() => handleVote('upped', thisComment.upped, 'downed', thisComment.downed )}>{isUpped ? 'upped' : 'notUpped'}</button>
        <button onClick={() => handleVote('downed', thisComment.downed, 'upped', thisComment.upped)}>{isDowned ? 'downed' : 'notDowned'}</button>
      </>
      <div>{thisComment.username}</div> <div>{thisComment.karma}</div> <div>{date}</div>
      <div>{thisComment.content}</div>
      <div>
        <div onClick={() => setShowReplyBox(!showReplyBox)}>reply</div>
        {!thisComment.isDeleted && username.currentUser && username.currentUser.uid === comment.userId ?
        <div>
          {showDeletePrompt ? <div>are you sure? <div onClick={() => handleRemove(prevParams)}>yes</div> / <div onClick={() => setShowDeletePrompt(!showDeletePrompt)}>no</div></div> : <div onClick={() => setShowDeletePrompt(!showDeletePrompt)}>delete</div>}
          <div onClick={() => edit()}>edit</div>
        </div>
        : 
        null
        }
      </div>
      {showEditBox ? <SubmitComment thisComment={thisComment} setThisComment={setThisComment} isEdit={true} prevText={thisComment.content} showReplyBox={showReplyBox} setShowReplyBox={setShowReplyBox} getUserName={getUserName} signIn={signIn} dbPath={prevParams} /> : null}
      {showReplyBox ? <SubmitComment showReplyBox={showReplyBox} setShowReplyBox={setShowReplyBox} getUserName={getUserName} signIn={signIn} dbPath={prevParams} /> : null}
      {level < 10 ? (childComments && childComments.length > 0 ? childComments.map(comment => <Comment key={uuidv4()} getComments={getComments} getUserName={getUserName} setColPath={setColPath} setTopComments={setTopComments} level={level + 1} comment={comment} prev={prevParams} />) : null)
      :
      <button onClick={() => getTopComments(prevParams)}>Continue this thread</button>}
    </div>
  )
}
