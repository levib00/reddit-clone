import React from "react";

const signInModal = ({ from, signInWithPopup }) => {
  return (
    <>
      Sign in to {from}
      <button onClick={signInWithPopup}>Sign in</button> 
    </>
  )
}