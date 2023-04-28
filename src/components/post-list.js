import React, { useState } from "react";
import { Post } from "./post";
import { Footer } from "./footer";

export const PostList = (props) => {
  const [start, setStart] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(25);

  const extend = () => {
    // TODO: Inject a div that tells the user the current page above this section of posts
    setNumberOfPosts(numberOfPosts + 25)
  }
  
  const loadNext = () => {
    setNumberOfPosts(numberOfPosts + 25)
    setStart(start + 25)
  }

  return (
    <div>
      {props.posts.slice(start, numberOfPosts).map(post => <Post key={post.title} title={post.title} />)}
      <Footer extend={extend} loadNext={loadNext}/>
    </div>
  )
}