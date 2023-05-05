import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SubmitLink } from "./submit-link";
import { SubmitText } from "./submit-text";

export const SubmitPage = () => {
  const [isLink, setIsLink] = useState(false)
  return (
    <div>
      <Link to='/submit/submit-link'><button>link</button></Link>
      <Link to='/submit/submit-text'><button>text</button></Link>
    </div>
  )
}