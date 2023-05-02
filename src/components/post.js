import React from "react";

export const Post = (props) => {
// TODO: destructure props.
  return (
    <div>
      <p>{props.post.karma}</p>
      <img src={props.post.img} alt={`${props.post.title}`}/>
      <div>
        <div>
          <div>{props.post.topic}</div>
          <div>{props.post.title}</div>
        </div>
        <div>
          <button>expand/collapse button</button>
          <div>
            <div>
              {props.post.timestamp}
            </div>
            <div>
              no. of comments
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}