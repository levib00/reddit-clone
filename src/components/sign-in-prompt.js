import React from "react";

export const SignInModal = ({ from, signInWithPopup, setShowSignIn }) => {
  return (
    <>
      Sign in to {from}
      <button onClick={signInWithPopup}>Sign in</button> 
      <button onClick={() => setShowSignIn(false)}>cancel</button>
    </>
  )
}