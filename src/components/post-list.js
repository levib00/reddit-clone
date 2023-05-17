import React, { useState, useEffect } from "react";
import { 
  getDocs,
  collection, 
  query,
  where,
} from 'firebase/firestore'
import {v4 as uuidv4} from 'uuid'
import { Post } from "./post";
import { Footer } from "./footer";
import { SideBar } from "./sidebar";
import { useParams } from "react-router-dom";

export const PostList = (props) => {
  // TODO: fix to work with tests again, might have to receive posts from app
  const { db } = props
  const { topic } = useParams()

  const [start, setStart] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(25);
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    const getPosts = async() => { 
      // Gets posts for selected topic (defaults to all if no topic is selected).
      let postCollection
      let postSnapshot
      const postArr = [];
      if (!topic) {
        postCollection = collection(db, 'posts');
        postSnapshot = await getDocs(postCollection);
        postSnapshot.docs.forEach(async doc => {
          const contents = doc.data()
          postArr.push(contents)
        })
      } else {
        const q = query(collection(db, "posts"), where("topic", "==", topic));

        postSnapshot = await getDocs(q);
        postSnapshot.forEach((doc) => {
          postArr.push(doc.data())
        });
      }
      
      return postArr
    }

    const characterSetter = async() => {
      try {
        setPosts(await getPosts())
      } catch(error) {
        console.error(error)
      }
    }
    characterSetter()
  }, [db, topic])

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
      <SideBar topic={topic}/>
      {posts ? posts.slice(start, numberOfPosts).map(post => <Post key={uuidv4()} post={post} />) : null}
      <Footer extend={extend} loadNext={loadNext}/>
    </div>
  )
}