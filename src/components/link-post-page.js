import React, { useEffect, useState } from "react";
import { SubmitComment } from "./commentSubmission";
import { Comment } from "./comment";
import { useParams, useLocation } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'
import { SideBar } from "./sidebar";

export const LinkPostPage = ({ db }) => {
  const { postId } = useParams()
  const location = useLocation()
  const { prevParams } = location.state

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState(null)
  const [colPath] = useState(prevParams || [db, 'posts', postId, 'comments'])
  // TODO: if props is null, useEffect to get information from database.

  useEffect(() => {
    const getPost = async() => { 
      // Gets coordinates for character chosen from dropdown.
      const postRef = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postRef);

      const contents = postSnapshot.data()
      return contents
    }
    const characterSetter = async() => { //rename
      try {
        setPost(await getPost())
      } catch(error) {
        console.error(error)
      }
    }
    characterSetter()
    console.log(post)
  }, [db])

  useEffect(() => {
    const getComments = async() => { 
      // Gets coordinates for character chosen from dropdown.
      const commentCollection = collection.apply(null, colPath)
      const commentSnapshot = await getDocs(commentCollection);
      const commentArr = [];
      commentSnapshot.docs.forEach(async doc => {
        const contents = doc.data()
        commentArr.push(contents)
      })
      return commentArr
    }

    const characterSetter = async() => { //renmame
      try {
        setComments(await getComments())
      } catch(error) {
        console.error(error)
      }
    }
    characterSetter()
  }, [db, postId])

  return (
    <div>
      {
      post ?
       <>
        <div>
          <img src={post.img} alt="scaled down image"/>
        </div>
        <div>
          <div>{post.title}</div>
          <div>
            <button>{/* // TODO: put in the function to open/close this, maybe just toggle hide on this and have the small image mbe constant. but it also has to change the image of the button*/}collapse/expand button</button>
            <div>{post.timestamp}</div>
            <div>{post.userId}</div>
          </div>
          <div>
            <img alt="scaled up image that can be collapsed by a button"/>
          </div>
        </div>
      </>
      :
      null
      }
      
      <SubmitComment />
      {comments ? comments.map(comment => <Comment key={uuidv4()} level={0} comment={ comment } db={db} prev={colPath}/>) : null}
    </div>
  )
}