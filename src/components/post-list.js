import React, { useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid'
import { Post } from "./post";
import { Footer } from "./footer";
import { SideBar } from "./sidebar";
import { useParams } from "react-router-dom";

export const PostList = (props) => {
  const { setTopic, postSetter, getUserName, db, signIn, uid } = props
  const { topic } = useParams()
  const { searchQuery } = useParams()

  const [posts, setPosts] = useState(null)
  const [numberOfPosts, setNumberOfPosts] = useState(25);
  const [username] = useState(getUserName())
  const [sortOption, setSortOption] = useState('timeStamp')

  const [start, setStart] = useState(0);

  const sortPosts = (posts, sortOption) => {
    posts.sort((a, b) => {
      if (b[sortOption] < a[sortOption]) {
        return -1;
      }
      if (b[sortOption] > a[sortOption]) {
        return 1;
      }
      return 0;
    });
    return posts
  }

  useEffect(() => {
    if (props.posts) {
      const sortedPosts = [...props.posts]
      setPosts(sortPosts(sortedPosts, sortOption))
    }
  }, [props.posts, sortOption])
  
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
    postSetter(topic, uid, searchQuery)
  }, [topic, uid, searchQuery])

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
      <div>
        <button onClick={() => setSortOption('timeStamp')}>new</button>
        <button onClick={() => setSortOption('karma')}>top</button>
      </div>
      <SideBar topic={topic}/>
      {posts ? posts.slice(start, numberOfPosts).map(post => React.isValidElement(post) ? post : <Post key={uuidv4()} posts={posts} setPosts={setPosts} db={db} username={username} signIn={signIn} getUserName={getUserName} post={post} from={'post-list'} />) : null}
      <Footer extend={extend} loadNext={loadNext}/>
    </div>
  )
}