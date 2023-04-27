import React from "react";

export const SubmitLink = () => {
  return (
    <div>
      <div>
        <label>url</label>
        <input type="text"></input>
      </div>
      <div>
        <label>image/video</label>
        <input type="file"></input>
      </div>
      <div>
        <label>title</label>
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