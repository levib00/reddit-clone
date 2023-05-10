import React, { useState, useEffect } from "react";
import { 
  getFirestore, 
  getDocs,
  getDoc, 
  doc, 
  setDoc, 
  collection, 
  serverTimestamp,
  addDoc,
  updateDoc,
} from 'firebase/firestore'
import {v4 as uuidv4} from 'uuid'
import { Post } from "./post";
import { Footer } from "./footer";

export const PostList = (props) => {
  // TODO: fix to work with tests again, might have to receive posts from app
  const {db} = props

  const [start, setStart] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(25);
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    const getPosts = async() => { 
      // Gets coordinates for character chosen from dropdown.
      const postCollection = collection(db, 'posts');
      const postSnapshot = await getDocs(postCollection);
      const postArr = [];

      postSnapshot.docs.forEach(async doc => {
        const contents = doc.data()
        postArr.push(contents)
      })
      
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
  }, [db])

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
      {posts ? posts.slice(start, numberOfPosts).map(post => <Post key={uuidv4()} post={post} />) : null}
      <Footer extend={extend} loadNext={loadNext}/>
    </div>
  )
}