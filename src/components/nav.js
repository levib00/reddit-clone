import React, { useState } from "react";

export const NavBar = (props) => {
  const {signIn, signOut, getUserName} = props

  const [username, setUserName] = useState(getUserName()) //might want to optimize by only doing this once and assigning it to state at App.js level

  return (
    <div>
      <div>
        <span>{username ? username.currentUser.displayName : null}</span>
        {username ? 
          <span onClick={async() => {
              await signOut
              setUserName(null)
            }}>Sign out
          </span>
          :
          <span onClick={async() => {
              await signIn()
              setUserName(getUserName())
            }}>Sign in
          </span>}
      </div>
      <div className="hero">
        cloneddit
      </div>
    </div>
  )
}
