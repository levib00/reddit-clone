import React from "react";

export const SubmitText = () => {
  return (
    <div>
      <div>
        <label>title</label>
        <textarea></textarea>
      </div>
      <div>
        <label>text</label>
        <textarea></textarea>
      </div>
      <div>
        <label>topic</label>
        <input type="text"></input>
      </div>
      <div>
        anything is saved and is subject to be removed at any time for any reason.
      </div>
      <button>Submit</button>
    </div>
  )
}