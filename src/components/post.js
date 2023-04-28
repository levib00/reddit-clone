import React from "react";

export const Post = (props) => {
  return (
    <div>
      <img></img>
      <div>
        <div>
          <div>topic</div>
          <div>{props.title}</div>
        </div>
        <div>
          <button>expand/collapse button</button>
          <div>
            <div>
              time
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