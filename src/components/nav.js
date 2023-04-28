import React from "react";

export const NavBar = (props) => {

  return (
    <div>
      <div>
        <span>{props.username}</span>
        <span>logout</span>
      </div>
      <div>
        <div className="hero">
          cloneddit
        </div>
      </div>
    </div>
  )
}
