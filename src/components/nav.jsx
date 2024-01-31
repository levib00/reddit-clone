import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

export default function NavBar(props) {
  const {
    signIn, signOut, getUserName, topic, isUserSignedIn,
  } = props;

  // Use state to manage the username
  const [username, setUserName] = useState(getUserName());

  return (
    <div className="nav">
      <div className="hero">
        {/* Link to the homepage and logo */}
        <Link to="/reddit-clone/">cloneddit</Link>
      </div>
      <div className="topic">
        {/* Display the topic */}
        {topic || null }
      </div>
      {/* User information and sign in/out */}
      <div className="user-info">
        {/* Display the username if the user is signed in */}
        <span className="username">
          {isUserSignedIn && username ? username.currentUser.displayName : null}
        </span>
        {isUserSignedIn && username ? <span className="spacer">|</span> : null}
        {/* Display "Sign out" or "Sign in" based on user sign-in status */}
        {isUserSignedIn
          ? (
            <button
              className="log-in-out"
              onClick={async () => {
                await signOut();
                setUserName(null);
              }}
            >
              Sign out
            </button>
          )
          : (
            <button
              className="log-in-out"
              onClick={async () => {
                await signIn();
                setUserName(getUserName());
              }}
            >
              Sign in
            </button>
          )}
      </div>
    </div>
  );
}
