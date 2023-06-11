import React, { useState } from "react";
import { Link } from "react-router-dom";

export const NavBar = (props) => {
  const {signIn, signOut, getUserName, topic, isUserSignedIn} = props

  // Use state to manage the username
  const [username, setUserName] = useState(getUserName())

  return (
    <div>
      {/* User information and sign in/out */}
      <div>
        {/* Display the username if the user is signed in */}
        <span>
          {isUserSignedIn && username ? username.currentUser.displayName : null}
        </span>
        {/* Display the topic */}
        {topic ? topic : null }
        {/* Display "Sign out" or "Sign in" based on user sign-in status */}
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
          </span>
        }
      </div>
      <div className="hero">
        {/* Link to the homepage and logo */}
       <Link to='/'>cloneddit</Link> 
      </div>
    </div>
  )
}
