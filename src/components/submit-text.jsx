import React, { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import SignInModal from './sign-in-prompt';
import SubmitPage from './submission-page';

export default function SubmitText(props) {
  const { db, getUserName, signIn } = props;

  // State variables
  const [titleInput, setTitleInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [showSignIn, setShowSignIn] = useState(false);
  const navigate = useNavigate();

  // Function to submit the posts to the database
  const submitPosts = async () => {
    if (topicInput === '' || titleInput === '') {
      return;
    }
    const username = await getUserName();
    if (username !== null) {
      const postId = uuidv4();
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
        uid: username.currentUser.uid,
      });
    } else {
      // Show the sign-in modal if the user is not signed in
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
      {/* Render the sign-in modal if user tries to do an action that requires them to be
      signed in */}
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signIn={signIn} from="submit a post" /> : null}
      <SubmitPage from="text" />
      {/* form for user to fill in content */}
      <span className="required-marker">* required</span>
      <div className="form-field">
        <label htmlFor="title" className="title-label">
          <span className="required-marker">*</span>
          title
          <textarea id="title" className="title-textbox" onChange={(e) => { setTitleInput(e.target.value); }} value={titleInput} />
        </label>
      </div>
      <div className="form-field">
        <label htmlFor="post-text" className="text-label">
          text
          <textarea id="post-text" className="text-textbox" onChange={(e) => { setTextInput(e.target.value); }} value={textInput} />
        </label>
      </div>
      <div className="form-field">
        <label htmlFor="topic-input" className="topic-label">
          <span className="required-marker">*</span>
          topic
          <input id="topic-input" className="topic-textbox" type="text" onChange={(e) => { setTopicInput(e.target.value); }} value={topicInput} />
        </label>
      </div>
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
