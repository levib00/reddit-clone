import React from "react";

export const SignInModal = ({ from, signIn, setShowSignIn }) => {
  return (
    <>
      Sign in to {from}
      <button onClick={signIn}>Sign in</button> 
      <button onClick={() => setShowSignIn(false)}>cancel</button>
    </>
  )
}