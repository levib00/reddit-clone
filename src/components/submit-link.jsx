import React, { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import SubmitPage from './submission-page';
import SignInModal from './sign-in-prompt';
import camera from '../assets/camera.png';
import cloud from '../assets/cloud.png';

const test = 'test';

export default function SubmitLink(props) {
  const { db, getUserName, signIn } = props;

  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  // Function to put files in a format firestore can hold
  async function handleFiles(files) {
    const file = files;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setSelectedFile(e.target.result);
    };
  }

  // Function to submit the link post
  const submitPosts = async () => {
    if (topicInput === '' || titleInput === '') {
      return;
    }
    const username = await getUserName();
    if (username !== null) {
      const postId = uuidv4();
      await setDoc(doc(db, 'posts', postId), {
        img: selectedFile || null,
        karma: 0,
        timeStamp: serverTimestamp(),
        title: titleInput,
        topic: topicInput,
        userId: username.currentUser.displayName,
        id: postId,
        upped: [],
        downed: [],
        saved: [],
        isDeleted: false,
        uid: username.currentUser.uid,
      });
    } else {
      setShowSignIn(true);
    }
  };

  const handleSubmitButton = () => {
    if (topicInput === '' || titleInput === '') {
      return;
    }
    submitPosts();
    navigate('/reddit-clone/');
  };

  return (
    <div className="post-submit">
      {/* Render the sign-in modal if user tries to do
      an action that requires them to be signed in */}
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from="submit a post" /> : null}
      <SubmitPage from="link" />
      {/* form for user to fill in content */}
      <span className="required-marker">* required</span>
      <div className="form-field">
        <p className="image-video-label">image/video</p>
        <label htmlFor="file-select" className="file-input">
          <img alt="submit-icon" className="camera submit-icon" src={camera} />
          Drop here or
          {' '}
          <div className="open-explorer">
            <img alt="open explorer" className="cloud submit-icon" src={cloud} />
            CHOOSE FILE
          </div>
        </label>
        <input
          required
          id="file-select"
          type="file"
          accept="video/*, image/*"
          onChange={(e) => {
            handleFiles(e.target.files[0]);
            setSelectedFile(e.target.files[0]);
          }}
        />
      </div>
      <label htmlFor={test} className="title-label form-field">
        <div>
          <span className="required-marker">*</span>
          title
        </div>
        <textarea id={test} className="title-textbox" required maxLength={300} onChange={(e) => { setTitleInput(e.target.value); }} value={titleInput} />
      </label>
      <label htmlFor="topic" className="topic-label form-field">
        <div>
          <span className="required-marker">*</span>
          topic
        </div>
        <input id="topic" className="topic-textbox" required type="text" onChange={(e) => { setTopicInput(e.target.value); }} value={topicInput} />
      </label>
      <p className="submit-blurb">
        Please try to keep posts appropriate. If you wouldn&apos;t share it with your workplace,
        don&apos;t share it here.
        Anything you post is subject to be deleted at any time.
      </p>
      {/* Button to submit post */}
      <button className="submit-post-button" onClick={handleSubmitButton}>
        Submit
      </button>
      <div className="credit-links">
        <a href="https://www.flaticon.com/free-icons/photography" title="photography icons">Camera icon created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/cloud-computing" title="cloud computing icons">Cloud icon created by Smartline - Flaticon</a>
      </div>
    </div>
  );
}
