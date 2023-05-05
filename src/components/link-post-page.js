import React from "react";
import { SubmitComment } from "./commentSubmission";
import { Comment } from "./comment";

export const postPage = () => {

  return (
    <div>
      <div>
        <img>scaled down image</img>
      </div>
      <div>
        <div>title</div>
        <div>
          <button>collapse/expand button</button>
          <div>timestamp</div>
          <div>user</div>
        </div>
        <div>
          <img>scaled up image that can be collapsed by a button</img>
        </div>
      </div>
      <SubmitComment />
      <Comment />
    </div>
  )
}