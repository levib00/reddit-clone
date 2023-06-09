import React, { useState } from "react";
import { Link } from "react-router-dom";

export const NavBar = (props) => {
  const {signIn, signOut, getUserName, topic, isUserSignedIn} = props

  const [username, setUserName] = useState(getUserName())

  return (
    <div>
      <div>
        <span>{isUserSignedIn && username ? username.currentUser.displayName : null}</span>
        {topic ? topic : null }
        {isUserSignedIn ? 
          <span onClick={async() => {
              await signOut()
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
       <Link to='/'>cloneddit</Link> 
      </div>
    </div>
  )
}
