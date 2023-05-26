import React, { useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid'
import { Post } from "./post";
import { Footer } from "./footer";
import { SideBar } from "./sidebar";
import { useParams } from "react-router-dom";

export const PostList = (props) => {
  const { setTopic, postSetter, getUserName, db, signInWithPopup } = props
  const { topic } = useParams()

  const [posts, setPosts] = useState(null) // TODO: add some sorting recent for sure, then maybe add separate option to sort by top
  const [numberOfPosts, setNumberOfPosts] = useState(25);
  const [username] = useState(getUserName())

  const [start, setStart] = useState(0);

  useEffect(() => {
    setPosts(props.posts)
  }, [props.posts])
  
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
      newPosts.splice(i * 25, 0, <div key={uuidv4()}>Page {i}</div>)
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
      {posts ? posts.slice(start, numberOfPosts).map(post => React.isValidElement(post) ? post : <Post key={uuidv4()} posts={posts} setPosts={setPosts} db={db} username={username} signInWithPopup={signInWithPopup} getUserName={getUserName} post={post} from={'post-list'} />) : null}
      <Footer extend={extend} loadNext={loadNext}/> {/*only load if # of posts is more than 25 */}
    </div>
  )
}