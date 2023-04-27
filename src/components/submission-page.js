import React, { useState } from "react";

export const SubmitPage = () => {
  const [isLink, setIsLink] = useState(false)
  return (
    <div>
      <button>link</button>
      <button>text</button>
    </div>
  )
}