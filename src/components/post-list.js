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
import { Post } from "./post";
import { Footer } from "./footer";

export const PostList = (props) => {
  // TODO: fix to work with tests again, might have to receive posts from app
  const {db} = props

  const [start, setStart] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(25);
  const [posts, setPosts] = useState(null)
  const [comments, setComments] = useState(null)

  useEffect(() => {
    const getPosts = async() => { 
      // Gets coordinates for character chosen from dropdown.
      const postCollection = collection(db, 'posts');
      const postSnapshot = await getDocs(postCollection);
      const postArr = [];
      const commentsArr = [];
      postSnapshot.docs.forEach(async doc => {
        const contents = doc.data()
        postArr.push(contents)
        const commentCollection = collection(db, 'posts', doc.id, 'comments'); // TODO: refactor to isolate getComments 
        const commentSnapshot = await getDocs(commentCollection); // TODO: might also make it so # of comments is just stored in posts level of db and doc.id is passed to post so that comments can be called when the page loads as opposed to as soon as post list is loaded. 
        commentSnapshot.docs.forEach(comment => {
          commentsArr.push(comment.data())
        })
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
      {posts ? posts.slice(start, numberOfPosts).map(post => <Post key={post.title} post={post} />) : null}
      <Footer extend={extend} loadNext={loadNext}/>
    </div>
  )
}