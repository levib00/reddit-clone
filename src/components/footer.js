import React from "react";

export const Footer = (props) => {
  const { extend, loadNext } = props

  return (
    <div>
      <div>
        {/* "Load more posts" button */}
        <button onClick={extend}>load more posts</button>
      </div>
      or 
      <div>
        {/* "Load the next page" button */}
        <button onClick={loadNext}>load the next page</button>
      </div> 
    </div>
  )
}
