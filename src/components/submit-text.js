import React, { useState } from "react";
import { SubmitPage } from "./submission-page";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";
import { Link } from "react-router-dom";

export const SubmitText = (props) => {
  const {db, getUserName, signIn} = props

// State variables
  const [titleInput, setTitleInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [topicInput, setTopicInput] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)

  // Function to submit the posts to the database
  const submitPosts = async() => {
    if(topicInput === '' || titleInput === '' ) {
      return
    }
    const username = await getUserName()
    if (username !== null) {
      const postId = uuidv4()
      // Store the post data in the "posts" collection
      await setDoc(doc(db, 'posts', postId), {
        text: textInput,
        karma: 0,
        upped: [],
        downed: [],
        timeStamp: serverTimestamp(),
        title: titleInput,
        topic: topicInput,
        userId: username.currentUser.displayName,
        id: postId,
        saved: [],
        isDeleted: false,
        uid: username.currentUser.uid
      });
    } else {
      // Show the sign-in modal if the user is not signed in
      setShowSignIn(true)
    }
  }

  return (
    <div className="post-submit">
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from={'submit a post'}/> : null}
      <SubmitPage from="text"/>
      <div className="form-field">
        <label className="title-label"><span className="required-marker">*</span>title</label>
        <textarea className="title-textbox" onChange={(e) => {setTitleInput(e.target.value)}} value={titleInput}></textarea>
      </div>
      <div className="form-field">
        <label className="text-label">text</label>
        <textarea className="text-textbox" onChange={(e) => {setTextInput(e.target.value)}} value={textInput}></textarea>
      </div>
      <div className="form-field">
        <label className="topic-label"><span className="required-marker">*</span>topic</label>
        <input className="topic-textbox" type="text" onChange={(e) => {setTopicInput(e.target.value)}} value={topicInput}></input>
      </div>
      <p className="submit-blurb">
        Please try to keep posts appropriate. If you wouldn't share it with your workplace, don't share it here.
        Anything you post is subject to be deleted at any time.
      </p >
      <Link to={'/'}  onClick={(e) => {
          if(topicInput === '' || titleInput === '' ) {
            e.preventDefault()
          }
          submitPosts()
        }}>
        <button className="submit-post-button" >
          Submit
        </button>
      </Link>
      <div className="credit-links">
        <a href="https://www.flaticon.com/free-icons/photography" title="photography icons">Camera icon created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/cloud-computing" title="cloud computing icons">Cloud icon created by Smartline - Flaticon</a>
      </div>
    </div>
  )
}
