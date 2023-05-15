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
          <div><Link to={`/topic/${props.post.topic}`}>{props.post.topic}</Link></div>
          <div>{props.post.title}</div>
        </div>
        <div>
          <button>expand/collapse button</button>
          <div>
            <div>
              {props.post.timestamp}
              {props.post.userId}
            </div>
            <div>
              { isImage ? <Link to={`/post/link/${props.post.id}`}>view comments</Link> : <Link to={`/text/${props.post.id}`}>view comments</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}