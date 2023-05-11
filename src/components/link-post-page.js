import React, { useEffect, useState } from "react";
import { SubmitComment } from "./commentSubmission";
import { Comment } from "./comment";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'

export const LinkPostPage = ({ db }) => {
  const { postId } = useParams()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState(null)
  const [colPath] = useState([db, 'posts', postId, 'comments'])
  // TODO: if props is null, useEffect to get information from database.

  useEffect(() => {
    const getPost = async() => { 
      // Gets coordinates for character chosen from dropdown.
      const postCollection = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postCollection);

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
      const commentCollection = collection(db, 'posts', postId, 'comments');
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
            <button>collapse/expand button</button>
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
      {comments ? comments.map(comment => <Comment key={uuidv4()} comment={ comment } db={db} prev={colPath}/>) : null}
    </div>
  )
}