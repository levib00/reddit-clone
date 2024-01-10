import { doc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {v4 as uuidv4} from 'uuid'
import { SubmitComment } from "./submit-comment";
import { SignInModal } from "./sign-in-prompt";
import RelativeTime from '@yaireo/relative-time'

export const Comment = ({ comment, setIsExpandedThread, colPath, level, setTopComments, setColPath, getUserName, signIn, updateDb, updateObj, comments }) => {
  // Extracting postId from URL parameters
  const { postId } = useParams()

  // State variables
  const [thisComment, setThisComment] = useState({...comment})
  const [childComments, setChildComments] = useState()
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [showEditBox, setShowEditBox] = useState(false)
  const [username] = useState(getUserName())
  const [isUpped, setIsUpped] = useState(username.currentUser && thisComment.upped ? thisComment.upped.includes(username.currentUser.uid) : false)
  const [isDowned, setIsDowned] = useState(username.currentUser && thisComment.downed ? thisComment.downed.includes(username.currentUser.uid) : false)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [relativeTime] = useState(new RelativeTime())

  useEffect(() => {
    // Update upvote and downvote states when the comment or the logged-in user changes
    if (username.currentUser) {
      setIsUpped(thisComment.upped ? thisComment.upped.includes(username.currentUser.uid) : false)
      setIsDowned(thisComment.downed ? thisComment.downed.includes(username.currentUser.uid) : false)
    }
  }, [thisComment, username.currentUser])

  // Fetch child comments when the postId, commentId, prev, or showReplyBox changes
  useEffect(() => {
    if (!comment.commentId) {
      return
    }
    const childCommentSetter = async() => {
      const childComments = comment.child
      setChildComments(childComments)        
    }
    childCommentSetter()
  }, [postId, comment.commentId, colPath, showReplyBox])

  // Update the comment's upvote/downvote arrays and karma for rendering purposes
  const updateRender = (primaryVoteArrCopy, primaryArrName, secondaryVoteArrCopy, secondaryArrName, primaryIndex, secondaryIndex) => {
    if (primaryIndex < 0) {
      primaryVoteArrCopy.push(username.currentUser.uid)
      if (!(secondaryIndex < 0)) {
        secondaryVoteArrCopy.splice(secondaryIndex, 1)
      }
      updateObj(primaryVoteArrCopy, secondaryVoteArrCopy, primaryArrName, secondaryArrName, thisComment, setThisComment)
    } else {
      primaryVoteArrCopy.splice(primaryIndex, 1)
      updateObj(primaryVoteArrCopy, null, primaryArrName, secondaryArrName, thisComment, setThisComment)
    }
  }

  // Passes calls functions to update state and Database with new upvotes and downvotes
  const updateVote = async(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr, newParams) => {
    if (username.currentUser) {
      const primaryIndex = primaryVoteArr.indexOf(username.currentUser.uid)
      const secondaryIndex = secondaryVoteArr.indexOf(username.currentUser.uid)
      const primaryVoteArrCopy = [...primaryVoteArr]
      const secondaryVoteArrCopy = [...secondaryVoteArr]
      
      updateRender(primaryVoteArrCopy, primaryArrName, secondaryVoteArrCopy, secondaryArrName, primaryIndex, secondaryIndex)
      try {
        updateDb(primaryArrName, secondaryArrName, primaryVoteArrCopy, secondaryVoteArrCopy, newParams)
      } catch (error) {
        console.error(error)
      }
    } else {
      setShowSignIn(true)
    }
  }

  const handleVote = async(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr) => {
    const newParams = colPath.commentId
    updateVote(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr, newParams)
  }

  // Remove the comment from the database
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

  // Handle the deletion of the comment
  const handleRemove = (prevParams) => {
    remove(prevParams)
    const clone = {...thisComment}
    clone.content = '[deleted]'
    clone.username = '[deleted]'
    clone.isDeleted = true
    setThisComment(clone)
  }

  // Toggle the edit comment form
  const edit = async () => {
    setShowEditBox(!showEditBox)
  }

  // Fetch the top-level comments for the thread continuation
  const getTopComments = async(prevs) => { 
    setColPath(prevs)
  }

  return (
    <div className={level === 0 ? `top-comment comment` : level % 2 ? 'nested-comment even comment' : 'nested-comment odd comment'}>
      {/* Modal for signing in if user is not logged in but tries an action that requires authentication */}
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from={'submit a comment'} getUserName={getUserName} /> : null}
      {/* TODO: add button to collapse/expand comment chains. */}
      <div className="comment-overview"> 
        <div className="voting-booth">
        {/* Button for upvoting */}
          <button aria-label="upvote button" className={isUpped ? 'arrow upvote upvoted' : 'arrow upvote not-upvoted'} onClick={() => handleVote('upped', thisComment.upped, 'downed', thisComment.downed )}></button>
          {/* Button for downvoting */}
          <button aria-label="downvote button" className={isDowned ? 'arrow downvote downvoted' : 'arrow downvote not-downvoted'} onClick={() => handleVote('downed', thisComment.downed, 'upped', thisComment.upped)}></button>
        </div>
        <div>
          {/* Display username, karma, and comment timestamp */}
          <div className="comment-data">
            <div className="comment-username">{thisComment.username}&nbsp;</div>
            <div className="comment-karma">{thisComment.karma} points</div>
            <div  className="comment-date">&nbsp;{typeof thisComment.timeStamp.seconds === 'number' ? relativeTime.from(new Date(thisComment.timeStamp.seconds*1000)).toString()
              :
              'now'}
            </div>
          </div>
          {/* Display comment content */}
          <div className="comment-text">{thisComment.content}</div>
          <div className="comment-actions">
            <div className="reply-button" onClick={() => setShowReplyBox(!showReplyBox)}>reply</div>
            {!thisComment.isDeleted && username.currentUser && username.currentUser.uid === comment.userId ?
            <div className="user-comment-actions">
              {showDeletePrompt ? <div>are you sure? <div className='delete-button' onClick={() => handleRemove(colPath.commentId)}>yes</div> / <div className='delete-button' onClick={() => setShowDeletePrompt(!showDeletePrompt)}>no</div></div> : <div className='delete-button' onClick={() => setShowDeletePrompt(!showDeletePrompt)}>delete</div>}
              <div className="edit-button" onClick={() => edit()}>edit</div>
            </div>
            :
            null
            }
          </div>
        </div>
      </div>
      {/* Edit comment form */}
      {showEditBox ? <SubmitComment thisComment={thisComment} setThisComment={setThisComment} isEdit={true} prevText={thisComment.content} showReplyBox={showReplyBox} setShowReplyBox={setShowReplyBox} getUserName={getUserName} signIn={signIn} parentId={comment.parentId} /> : null}
      {/* Reply comment form */}
      {showReplyBox ? <SubmitComment comments={comments} showReplyBox={showReplyBox} setShowReplyBox={setShowReplyBox} dbPath={colPath} getUserName={getUserName} signIn={signIn} parentId={comment.commentId} /> : null}
      {/* Display child comments */}
      {level < 10 ? ((childComments && childComments.length > 0) ? childComments.map(comment => <Comment key={uuidv4()} comments={comments} setIsExpandedThread={setIsExpandedThread} getUserName={getUserName} updateObj={updateObj} updateDb={updateDb} setColPath={setColPath} setTopComments={setTopComments} level={level + 1} comment={comment} colPath={colPath} child={childComments}/>) : null)
      :
      <div className="continue-thread-button" onClick={() => {
        setIsExpandedThread(true)
        getTopComments(colPath)}
      }>load more comments</div>}
    </div>
  )
}
