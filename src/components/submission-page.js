import React from "react";
import { Link } from "react-router-dom";

export const SubmitPage = ({from}) => {
  return (
    <div className="submit-page">
      {/* change what kind of post user wants to submit */}
      <div className="post-type-selector-container">
        <Link to='/submit/submit-link'><button className={ from === 'link' ? 'selected post-type-selector' : 'post-type-selector'}>link</button></Link>
        <Link to='/submit/submit-text'><button className={ from === 'text' ? 'selected post-type-selector' : 'post-type-selector'}>text</button></Link>
      </div>
    </div>
  )
}
