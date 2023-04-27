import React, { useState, useEffect } from "react";

export const Comment = (props) => {
  const [postId] = useState(null)
  return (
    <div>
      <div>{postId.user}</div> <div>{postId.timeStamp}</div>
      <div>{postId.content}</div>
      {postId.hasReply ? <Comment /> : null}
    </div>
  )
}