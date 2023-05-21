import React from "react";
import { Link } from "react-router-dom";

export const SubmitPage = () => {
  return (
    <div>
      <Link to='/submit/submit-link'><button>link</button></Link>
      <Link to='/submit/submit-text'><button>text</button></Link>
    </div>
  )
}