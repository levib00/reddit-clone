import React from "react";

export const Footer = (props) => {
  const { extend, loadNext } = props

  return (
    <div>
      <div onClick={extend}>load more posts</div> or <div onClick={loadNext}>load the next page</div> 
    </div>
  )
}