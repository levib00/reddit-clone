import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Post = ({post}) => {
  const {img, karma, title, text, topic, timestamp, userId, id} = post
  
  const [isImage, setIsImage] = useState(null)

  useEffect(() => {
    setIsImage(img ? true : false)
  }, [img])

  return (
    <div>
      <p>{karma}</p>
      { isImage ? <img src={img} alt={`${title}`}/> : <div>{text}</div>}
      <div>
        <div>
          <div><Link to={`/topic/${topic}`}>{topic}</Link></div>
          <div>{title}</div>
        </div>
        <div>
          <button>expand/collapse button</button>
          <div>
            <div>
              {timestamp}
              {userId}
            </div>
            <div>
              { isImage ? <Link to={`/post/link/${id}`}>view comments</Link> : <Link to={`/text/${id}`}>view comments</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}