import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import expandText from '../assets/text-image.png'
import collapse from '../assets/collapse.png';
import expandImage from '../assets/expand-img.png';
import { doc, updateDoc } from "firebase/firestore";
import { SignInModal } from "./sign-in-prompt";

export const Post = ({post, username, db, setPosts, posts, getUserName, signInWithPopup, from}) => {
  const {img, karma, title, text, topic, timeStamp, userId, id, upped, downed} = post
  
  const [isImage, setIsImage] = useState(null)
  const [expanded, setExpanded] = useState(from === 'post-page' ? true : false)
  const [isUpped, setIsUpped] = useState(upped.includes(username.currentUser.uid))
  const [isDowned, setIsDowned] = useState(downed.includes(username.currentUser.uid))
  const [showSignIn,setShowSignIn] = useState(null)

  useEffect(() => {
    setIsImage(img ? true : false)
  }, [img])

  const updatePosts = (newVote, newOtherVote = null, posts, post) => {
    const postsIndex = posts.indexOf(post)
    const newPosts = [...posts]
    newPosts[postsIndex].upped = newVote
    if (newOtherVote !== null) {
      newPosts[postsIndex].downed = newOtherVote
    }
    newPosts[postsIndex].karma = newPosts[postsIndex].upped - newPosts[postsIndex].downed
    setPosts(newPosts)
  }

  const updateVote = async(voteArr, vote, otherArr, otherVote) => {
    if (username.currentUser) {
      const postUpdate = doc(db, 'posts', id)
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
        updatePosts(newVote, newOtherVote, posts, post, voteArr)
      } else {
        const newVote = [...vote]
        newVote.splice(index, 1)
        await updateDoc(postUpdate, {
          [voteArr]: newVote,
          karma: newVote.length - newOtherVote.length
        })
        updatePosts(newVote, null, posts, post)
      }
    } else {
      setShowSignIn(true)
    }
  }

  const handleVote = async(voteArr, vote, otherArr, otherVote) => {
    updateVote(voteArr, vote, otherArr, otherVote)
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signInWithPopup={signInWithPopup} from={'submit a comment'} getUserName={getUserName} /> : null}
      <div>
        <button onClick={() => handleVote('upped', upped,'downed', downed)}>{isUpped ? 'upped' : 'not upped'}</button>
        <p>{karma}</p>
        <button onClick={() => handleVote('downed', downed, 'upped', upped)}>{isDowned ? 'downed' : 'not downed'}</button>
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