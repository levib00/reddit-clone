import React, { useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid'
import { Post } from "./post";
import { Footer } from "./footer";
import { SideBar } from "./sidebar";
import { useParams } from "react-router-dom";

export const PostList = (props) => {
  const { setTopic, postSetter } = props
  const { topic } = useParams()

  const [posts, setPosts] = useState(props.posts)
  const [numberOfPosts, setNumberOfPosts] = useState(25);

  const [start, setStart] = useState(0);
  
  useEffect(() => {
    if (topic) {
      setTopic(topic)
    } else {
      setTopic('all')
    }
  }, [topic, setTopic])

  useEffect(() => {
    return () => {
      setTopic('all')
    }
  }, [setTopic])

  useEffect(() => {
    postSetter(topic)
  }, [topic])

  const extend = () => {
    setNumberOfPosts(numberOfPosts + 25)
    const newPosts = [...posts]
    for ( let i = 0; i < numberOfPosts / 25; i ++) {
      newPosts.splice(i * 25, 0, <div>Page {i}</div>)
    }
    setPosts(newPosts)
  }
  
  const loadNext = () => {
    setNumberOfPosts(numberOfPosts + 25)
    setStart(start + 25)
  }
  
  return (
    <div>
      <SideBar topic={topic}/>
      {posts ? posts.slice(start, numberOfPosts).map(post => React.isValidElement(post) ? post : <Post key={uuidv4()} post={post} />) : null}
      <Footer extend={extend} loadNext={loadNext}/>
    </div>
  )
}