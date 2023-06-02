import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import expandText from '../assets/text-image.png'
import collapse from '../assets/collapse.png';
import expandImage from '../assets/expand-img.png';
import { doc, updateDoc } from "firebase/firestore";
import { SignInModal } from "./sign-in-prompt";

export const Post = ({post, db, getUserName, signInWithPopup, from}) => {
  const {img, title, text, topic, timeStamp, userId, id, upped, downed} = post
  
  const [username] = useState(getUserName())
  const [isImage, setIsImage] = useState(null)
  const [thisPost, setThisPost] = useState({...post})
  const [expanded, setExpanded] = useState(from === 'post-page' ? true : false)
  const [isUpped, setIsUpped] = useState(upped.includes(username.currentUser.uid))
  const [isDowned, setIsDowned] = useState(downed.includes(username.currentUser.uid))
  const [showSignIn,setShowSignIn] = useState(null)
  
  useEffect(() => {
    setIsImage(img ? true : false)
  }, [img])

  useEffect(() => {
    setIsUpped(thisPost.upped ? thisPost.upped.includes(username.currentUser.uid) : false)
    setIsDowned(thisPost.downed ? thisPost.downed.includes(username.currentUser.uid) : false)
  }, [thisPost, username.currentUser.uid])


  const updatePosts = (newVote, newOtherVote = null, voteArr, otherArr) => {
    const clone = {...thisPost}
    clone[voteArr] = newVote

    if (newOtherVote !== null) {
      clone[otherArr] = newOtherVote
    }
    clone.karma = clone.upped.length - clone.downed.length
    setThisPost(clone)
  }

  const updateVote = async(voteArr, vote, otherArr, otherVote, newParams) => { // * this needs to be refactored and simplified.
    if (username.currentUser) {
      const postUpdate = await doc.apply(null, newParams)
      const index = vote.indexOf(username.currentUser.uid)
      const otherIndex = otherVote.indexOf(username.currentUser.uid)
      const newOtherVote = [...otherVote]
      const newVote = [...vote]
      if (index < 0) {
        newVote.push(username.currentUser.uid)
        if (!(otherIndex < 0)) {
          newOtherVote.splice(otherIndex, 1)
        }
        updatePosts(newVote, newOtherVote, voteArr, otherArr, thisPost)
      } else {
        newVote.splice(index, 1)
        updatePosts(newVote, null, voteArr, otherArr, thisPost)
      }
      if (voteArr === 'upped') { // * I still think there is a better way to do this
        await updateDoc(postUpdate, {
          [voteArr]: newVote,
          [otherArr]: newOtherVote,
          karma: newVote.length - newOtherVote.length
        });
      } else {
        await updateDoc(postUpdate, {
          [voteArr]: newVote,
          [otherArr]: newOtherVote,
          karma: newOtherVote.length - newVote.length
        });
      }
    } else {
      //setShowSignIn(true)
    }
  }

  const handleVote = async(voteArr, vote, otherArr, otherVote) => {
    updateVote(voteArr, vote, otherArr, otherVote, [db, 'posts', id])
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signInWithPopup={signInWithPopup} from={'submit a comment'} getUserName={getUserName} /> : null}
      <div>
        <button onClick={() => handleVote('upped', thisPost.upped,'downed', thisPost.downed)}>{isUpped ? 'upped' : 'not upped'}</button>
        <p>{thisPost.karma}</p>
        <button onClick={() => handleVote('downed', thisPost.downed, 'upped', thisPost.upped)}>{isDowned ? 'downed' : 'not downed'}</button>
      </div>
      { isImage ? <img src={img} alt={`${title}`}/> : null}
      <div>
        <div>
          <div><Link to={`/topic/${topic}`}>{topic}</Link></div>
          <div>{title}</div>
        </div>
        <div> {/*maybe move background image of below button into css backgrounds*/ }
          {from === 'post-list' ? <button onClick={() => setExpanded(!expanded)}>{expanded ? <img src={collapse}></img> : isImage ? <img src={expandImage}></img> : <img src={expandText}></img>}</button> : null}
          <div>
            <div>
              {timeStamp ? new Date(timeStamp.seconds*1000).toString() : null}
              {userId}
            </div>
            <div>
              <Link to={`/post/link/${id}`}>view comments</Link>
            </div>
            { expanded ? isImage ? <img src={img} alt={`${title}`}/> : <div>{text}</div> : null  }
          </div>
        </div>
      </div>
    </div>
  )
}
