import React, { useState } from "react";
import { Link } from "react-router-dom";

export const NavBar = (props) => {
  const {signIn, signOut, getUserName, topic} = props

  const [username, setUserName] = useState(getUserName())

  return (
    <div>
      <div>
        <span>{username ? username.currentUser !== null ? username.currentUser.displayName : null : null}</span>
        {topic ? topic : null }
        {username ? 
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
