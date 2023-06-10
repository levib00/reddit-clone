import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import expandText from '../assets/text-image.png'
import collapse from '../assets/collapse.png';
import expandImage from '../assets/expand-img.png';
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { SignInModal } from "./sign-in-prompt";

export const Post = ({post, db, getUserName, signInWithPopup, from}) => {
  const {img, title, topic, timeStamp, id, upped, downed, saved} = post
  
  const [username] = useState(getUserName())
  const [isImage, setIsImage] = useState(null)
  const [thisPost, setThisPost] = useState({...post})
  const [expanded, setExpanded] = useState(from === 'post-page' ? true : false)
  const [isUpped, setIsUpped] = useState(username.currentUser && upped.includes(username.currentUser.uid))
  const [isDowned, setIsDowned] = useState(downed.includes(username.currentUser && username.currentUser.uid))
  const [isSaved, setIsSaved] = useState(saved.includes(username.currentUser && username.currentUser.uid))
  const [showSignIn, setShowSignIn] = useState(null)
  const [showDeletePrompt, setShowDeletePrompt] = useState(false)
  
  useEffect(() => {
    setIsImage(img ? true : false)
  }, [img])

  useEffect(() => {
    if (username.currentUser) {
      setIsSaved(thisPost.saved ? thisPost.saved.includes(username.currentUser.uid) : false)
      setIsUpped(thisPost.upped ? thisPost.upped.includes(username.currentUser.uid) : false)
      setIsDowned(thisPost.downed ? thisPost.downed.includes(username.currentUser.uid) : false)
    }
  }, [thisPost, username.currentUser])

  const updatePosts = (updatedArr, secondaryUpdatedArr = null, primaryArrName, secondaryArrName) => {
    const clone = {...thisPost}
    clone[primaryArrName] = updatedArr

    if (secondaryUpdatedArr !== null) {
      clone[secondaryArrName] = secondaryUpdatedArr
    }

    clone.karma = clone.upped.length - clone.downed.length // change to happen conditionally
    setThisPost(clone)
  }

  const updateVoteDb = async(primaryArrName, primaryVoteArrCopy, secondaryArrName, secondaryVoteArrCopy, newParams) => {
    let postUpdate

    try {
      postUpdate = await doc.apply(null, newParams)
    } catch(error) {
      console.error(error)
    }

    if (primaryArrName === 'upped') { // * I still think there is a better way to do this
      try{
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
        await updateDoc(postUpdate, {
          [primaryArrName]: primaryVoteArrCopy,
          [secondaryArrName]: secondaryVoteArrCopy,
          karma: secondaryVoteArrCopy.length - primaryVoteArrCopy.length
        });
      } catch (error) {
        console.error(error)
      }
    }
  }

  const updateVoteRender = (primaryArrName, primaryVoteArrCopy, secondaryArrName, secondaryVoteArrCopy, primaryIndex, secondaryIndex) => {
    if (primaryIndex < 0) {
      primaryVoteArrCopy.push(username.currentUser.uid)
      if (!(secondaryIndex < 0)) {
        secondaryVoteArrCopy.splice(secondaryIndex, 1)
      }
      updatePosts(primaryVoteArrCopy, secondaryVoteArrCopy, primaryArrName, secondaryArrName, thisPost)
    } else {
      primaryVoteArrCopy.splice(primaryIndex, 1)
      updatePosts(primaryVoteArrCopy, null, primaryArrName, secondaryArrName, thisPost)
    }
  }

  const updateVote = async(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr, newParams) => { // * this needs to be refactored and simplified.
    if (username.currentUser) {
      const primaryIndex = primaryVoteArr.indexOf(username.currentUser.uid)
      const secondaryIndex = secondaryVoteArr.indexOf(username.currentUser.uid)
      const primaryVoteArrCopy = [...primaryVoteArr]
      const secondaryVoteArrCopy = [...secondaryVoteArr]
      
      updateVoteRender(primaryArrName, primaryVoteArrCopy, secondaryArrName, secondaryVoteArrCopy, primaryIndex, secondaryIndex)
      updateVoteDb(primaryArrName, primaryVoteArrCopy, secondaryArrName, secondaryVoteArrCopy, newParams)
    } else {
      setShowSignIn(true)
    }
  }

  const updateSavesRender = (savedArrName, savedArrCopy, index) => {
    if (index < 0) {
      savedArrCopy.push(username.currentUser.uid)
      updatePosts(savedArrCopy, null, savedArrName, thisPost)
    } else {
      savedArrCopy.splice(index, 1)
      updatePosts(savedArrCopy, null, savedArrName, thisPost)
    }
  }

  const updateSavesDb = async(primaryArrName, primaryVoteArrCopy, newParams) => {
    try {
      let postUpdate = await doc.apply(null, newParams)
      await updateDoc(postUpdate, {
        [primaryArrName]: primaryVoteArrCopy,
      });
    } catch(error) {
      console.error(error)
    }
  }

  const updateSaves = async(savedArrName, savedArr, newParams) => { // * this needs to be refactored and simplified.
    if (username.currentUser) {
      const index = savedArr.indexOf(username.currentUser.uid)
      const savedArrCopy = [...savedArr]

      updateSavesRender(savedArrName, savedArrCopy, index)
      updateSavesDb(savedArrName, savedArrCopy, newParams)
    } else {
      setShowSignIn(true)
    }
  }

  const handleVote = async(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr) => {
    updateVote(primaryArrName, primaryVoteArr, secondaryArrName, secondaryVoteArr, [db, 'posts', id]) // hardcode path
  }

  const savePost = async() => {
    try {
      const q = doc(db, "saved", username.currentUser.uid)
      await updateDoc(q, {
        savedPosts: arrayUnion(doc(db, 'posts', thisPost.id))
      });
    } catch(error) {
      console.error(error)
    }
  }

  const unsavePost = async() => {
    try {
      const q = doc(db, "saved", username.currentUser.uid)
      await updateDoc(q, {
        savedPosts: arrayRemove(doc(db, 'posts', thisPost.id))
      });
    } catch(error) {
      console.error(error)
    }
  }

  const handleSave = (arrName, arr) => {
    savePost()
    updateSaves(arrName, arr, [db, 'posts', id])
  }

  const handleUnsave = (arrName, arr) => {
    unsavePost()
    updateSaves(arrName, arr, [db, 'posts', id])
  }

  const handleRemove = (postPath) => {
    remove(postPath)
    const clone = {...thisPost}
    clone.title = '[deleted]'
    clone.userId = '[deleted]'
    clone.isDeleted = true

    if (clone.img) {
      clone.img = '[deleted]'
    } else {
      clone.text = '[deleted]'
    }
    setThisPost(clone)
  }

  const remove = async(postPath) => {
    try {
      let postUpdate= await doc.apply(null, postPath)
      await updateDoc(postUpdate, {
        title: '[deleted]',
        userId: '[deleted]',
        text: '[deleted]',
        isDeleted: true,
      })
    } catch (error) {
      console.error()
    }
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signInWithPopup={signInWithPopup} from={'submit a comment'} getUserName={getUserName} /> : null}
      <div>
        <button onClick={() => handleVote('upped', thisPost.upped,'downed', thisPost.downed)}>{isUpped ? 'upped' : 'notUpped'}</button>
        <p>{thisPost.karma}</p>
        <button onClick={() => handleVote('downed', thisPost.downed, 'upped', thisPost.upped)}>{isDowned ? 'downed' : 'notDowned'}</button>
      </div>
      { isImage ? <img src={img} alt={`${title}`}/> : null}
      <div>
        <div>
          <div><Link to={`/topic/${topic}`}>{topic}</Link></div>
          <div>{thisPost.title}</div>
        </div>
        <div> {/*maybe move background image of below button into css backgrounds*/ }
          {from === 'post-list' ? <button className={'expand/collapse'} onClick={() => setExpanded(!expanded)}>{expanded ? <img src={collapse}></img> : isImage ? <img src={expandImage}></img> : <img src={expandText}></img>}</button> : null}
          <div>
            <div>
              <div>{timeStamp ? new Date(timeStamp.seconds*1000).toString() : null}</div>
              <div>{thisPost.userId}</div>
            </div>
            <div>
              <Link to={`/post/${id}`}>view comments</Link>
            </div>
            {!isSaved ? <div onClick={() => handleSave('saved', thisPost.saved)}>
              save
            </div> 
            :
            <div onClick={() => handleUnsave('saved', thisPost.saved)}>
              unsave
            </div>}
            {!thisPost.isDeleted && username.currentUser && username.currentUser.uid === thisPost.uid ?
            <div>
              {showDeletePrompt ? <div>are you sure? <div onClick={() => handleRemove([db, 'posts', id])}>yes</div> / <div onClick={() => setShowDeletePrompt(!showDeletePrompt)}>no</div></div> : <div onClick={() => setShowDeletePrompt(!showDeletePrompt)}>delete</div>}
            </div>
            : 
            null}
            { expanded ? isImage ? <img src={img} alt={`${title}`}/> : <div>{thisPost.text}</div> : null  }
          </div>
        </div>
      </div>
    </div>
  )
}
