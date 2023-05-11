import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Post = (props) => {
  
  // TODO: destructure props.
  const [isImage, setIsImage] = useState(null)

  useEffect(() => {
    setIsImage(props.post.img ? true : false)
  }, [props.post.img])

  return (
    <div>
      <p>{props.post.karma}</p>
      { isImage ? <img src={props.post.img} alt={`${props.post.title}`}/> :  <div>{props.post.text}</div>}
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
              { isImage ? <Link to={`/link/${props.post.id}`}>no. of comments</Link> : <Link to={`/text/${props.post.id}`}>no. of comments</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}