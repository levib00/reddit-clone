/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

export default function SignInModal({ from, signIn, setShowSignIn }) {
  return (
    <div className="prevent-click-for-prompt" onClick={() => setShowSignIn(false)}>
      <div className="sign-in-prompt" onClick={(e) => e.stopPropagation()}>
        {/* message changes based on what action the user was trying to do. */}
        <div className="sign-in-text">
          Sign in to
          {from}
          !
        </div>
        <div className="prompt-button-container">
          {/* Creates popup user can use to sign in */}
          <button
            className="prompt-sign-in-button prompt-button"
            onClick={() => {
              signIn();
              setShowSignIn(false);
            }}
          >
            Sign in
          </button>
          {/* Close form */}
          <button className="prompt-cancel-button prompt-button" onClick={() => setShowSignIn(false)}>cancel</button>
        </div>
      </div>
    </div>
  );
}
