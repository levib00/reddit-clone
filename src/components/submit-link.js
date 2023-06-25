import React, { useState } from "react";
import { SubmitPage } from "./submission-page";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";
import camera from "../assets/camera.png"
import cloud from "../assets/cloud.png"
import { Link } from "react-router-dom";

export const SubmitLink = (props) => {
  const {db, getUserName, signIn} = props

  // State variables
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [titleInput, setTitleInput] = useState('')
  const [topicInput, setTopicInput] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)

  // Function to put files in a format firestore can hold
  async function handleFiles(files) {
    const file = files;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setSelectedFile(e.target.result)
    }
  }

  // Function to submit the link post
  const submitPosts = async() => {
    const username = await getUserName().currentUser.displayName
    if (username !== null) {
      const postId = uuidv4()
      await setDoc(doc(db, 'posts', postId), {
        img: selectedFile,
        karma: 0,
        timeStamp: serverTimestamp(),
        title: titleInput,
        topic: topicInput,
        userId: username,
        id: postId,
        upped: [],
        downed: [],
        saved: [],
        isDeleted: false,
        uid: username.currentUser.uid
      });
    } else {
      setShowSignIn(true)
    }
  }

  return (
    <div className="post-submit">
      {/* Render the sign-in modal if user tries to do an action that requires them to be signed in */}
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from={'submit a post'}/> : null}
      <SubmitPage from='link' />
      {/* form for user to fill in content */}
      <div className="form-field">
        <p className="image-video-label">image/video</p>
        <label htmlFor='file-select' className="file-input"><img className="camera submit-icon" src={camera} />Drop here or <div className="open-explorer"><img className="cloud submit-icon" src={cloud} />CHOOSE FILE</div></label>
        <input required={true}
         id='file-select'
         type="file" accept="video/*, image/*"
         onChange={(e) => {
          handleFiles(e.target.files[0])
          setSelectedFile(e.target.files[0])
        }}/>
      </div>
      <div className="form-field">
        <label className="title-label"><span className="required-marker">*</span>title</label>
        <textarea className="title-textbox" required={true} maxLength={300}  onChange={(e) => {setTitleInput(e.target.value)}} value={titleInput}></textarea>
      </div>
      <div className="form-field">
        <label className="topic-label"><span className="required-marker">*</span>topic</label>
        <input className="topic-textbox" required={true} type="text" onChange={(e) => {setTopicInput(e.target.value)}} value={topicInput}></input>
      </div>
      <p className="submit-blurb">
        Please try to keep posts appropriate. If you wouldn't share it with your workplace, don't share it here.
        Anything you post is subject to be deleted at any time.
      </p>
      {/* Button to submit post */}
      <Link to={'/'} onClick={() => submitPosts()}>
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
