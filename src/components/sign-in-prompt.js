import React from "react";

export const SignInModal = ({ from, signIn, setShowSignIn }) => {
  return (
    <>
      {/* message changes based on what action the user was trying to do. */}
      Sign in to {from}
      {/* Creates popup user can use to sign in */}
      <button onClick={signIn}>Sign in</button> 
      {/* Close form */}
      <button onClick={() => setShowSignIn(false)}>cancel</button>
    </>
  )
}
