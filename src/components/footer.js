import React from "react";

export const Footer = (props) => {
  const { extend, loadNext } = props

  return (
    <div>
      <div><button onClick={extend}>load more posts</button></div> or <div> <button onClick={loadNext}>load the next page</button></div> 
    </div>
  )
}