import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import expandText from '../assets/text-image.png'
import collapse from '../assets/collapse.png';
import expandImage from '../assets/expand-img.png';
import { doc, updateDoc } from "firebase/firestore";

export const Post = ({post, username, db}) => {
  const {img, karma, title, text, topic, timestamp, userId, id, upped, downed} = post
  
  const [isImage, setIsImage] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [isUpped, setIsUpped] = useState(upped.includes(username.currentUser.uid))
  const [isDowned, setIsDowned] = useState(downed.includes(username.currentUser.uid))

  useEffect(() => {
    setIsImage(img ? true : false)
  }, [img])

  const updateVote = async(voteArr, vote, otherArr, otherVote) => {
    if (username.currentUser) {
      const postUpdate = doc(db, 'posts', id)
      const index = vote.indexOf(username.currentUser.uid)
      const otherIndex = otherVote.indexOf(username.currentUser.uid)
      if (index < 0) {
        await updateDoc(postUpdate, {
          [voteArr]: [...vote, username.currentUser.uid]
        })
      } else {
        const newVote = [...vote]
        newVote.splice(index, 1)
        await updateDoc(postUpdate, {
          [voteArr]: newVote
        })
      }
      if (otherIndex < 0) {
        const newVote = [...otherVote]
        newVote.splice(otherIndex, 1)
        await updateDoc(postUpdate, {
          [otherArr]: newVote
        })
      }
    } else {
      //TODO: sign in prompt here
    }
  }

  const handleVote = (voteArr, vote) => {
    updateVote(voteArr, vote)
  }

  return (
    <div>
      <p>{karma}</p>
      { isImage ? <img src={img} alt={`${title}`}/> : <div>{text}</div>}
      <div>
        <div>
          <button onClick={() => handleVote('upped', upped,'downed', downed)}>{isUpped ? 'upped' : 'not upped'}</button>
          <p>{karma}</p>
          <button onClick={() => handleVote('downed', downed, 'upped', upped)}>{isDowned ? 'downed' : 'not downed'}</button>
        </div>
        <div>
          <div><Link to={`/topic/${topic}`}>{topic}</Link></div>
          <div>{title}</div>
        </div>
        <div>
          <button onClick={() => setExpanded(!expanded)}>{expanded ? <img src={collapse}></img> : isImage ? <img src={expandImage}></img> : <img src={expandText}></img>}</button>
          <div>
            <div>
              {timestamp}
              {userId}
            </div>
            <div>
              { isImage ? <Link to={`/post/link/${id}`}>view comments</Link> : <Link to={`/text/${id}`}>view comments</Link>}
            </div>
            { expanded ? isImage ? <img src={img} alt={`${title}`}/> : <div>{text}</div> : null  }
          </div>
        </div>
      </div>
    </div>
  )
}