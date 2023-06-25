import React, { useState, useEffect } from "react";
import {v4 as uuidv4} from 'uuid'
import { Post } from "./post";
import { Footer } from "./footer";
import { SideBar } from "./sidebar";
import { useParams } from "react-router-dom";

export const PostList = (props) => {
  const { setTopic, postSetter, getUserName, db, signIn, uid, updateDb, updateObj } = props
  // Extract topic or search query from url
  const { topic } = useParams()
  const { searchQuery } = useParams()

  // State variables
  const [posts, setPosts] = useState(null)
  const [numberOfPosts, setNumberOfPosts] = useState(25);
  const [username] = useState(getUserName())
  const [sortOption, setSortOption] = useState('timeStamp')
  const [start, setStart] = useState(0);

  // Function to sort posts based on a given sort option
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
  
  // Set the topic extracted above
  useEffect(() => { 
    if (topic) {
      setTopic(topic)
    } else {
      setTopic('all')
    }
  }, [topic, setTopic])

  // Reset the topic when the component is unmounted
  useEffect(() => {
    return () => {
      setTopic('all')
    }
  }, [setTopic])

  // Fetch posts based on the topic, user ID, and search query
  useEffect(() => {
    postSetter(topic, uid, searchQuery)
  }, [topic, uid, searchQuery])


  // Function to extend the number of posts displayed
  const extend = () => {
    setNumberOfPosts(numberOfPosts + 25)
    const newPosts = [...posts]
    for ( let i = 0; i < numberOfPosts / 25; i ++) {
      newPosts.splice(i * 25, 0, <div key={uuidv4()}>Page {i}</div>)
    }
    setPosts(newPosts)
  }
  
  // Function to load the next set of posts
  const loadNext = () => {
    setNumberOfPosts(numberOfPosts + 25)
    setStart(start + 25)
  }
  
  return (
    <div className="post-list-page">
      <SideBar topic={topic}/>
      <div className="post-list">
        {/* Sorting options */}
        <div className="sort-post-list">
          <button className={sortOption === 'timeStamp' ? "sort-button selected-sort" : 'sort-button'} onClick={() => setSortOption('timeStamp')}>new</button>
          <button className={sortOption === 'karma' ? "sort-button selected-sort" : 'sort-button'} onClick={() => setSortOption('karma')}>top</button>
        </div>
        {/* Render posts */}
        {posts ? posts.slice(start, numberOfPosts).map((post, index) => React.isValidElement(post) ? post : <Post key={uuidv4()} index={index} posts={posts} setPosts={setPosts} db={db} username={username} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} post={post} from={'post-list'} />) : null}
        {posts.length > numberOfPosts ? <Footer extend={extend} loadNext={loadNext}/> : null}
      </div>
    </div>
  )
}