import React, { useEffect, useState } from "react";
import { SubmitComment } from "./commentSubmission";
import { Comment } from "./comment";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'
import { SideBar } from "./sidebar";

export const LinkPostPage = ({ db }) => {
  const { postId } = useParams()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState(null)
  const [colPath, setColPath] = useState([db, 'posts', postId, 'comments'])

  useEffect(() => { // TODO: see if i can combine this with the other useEffect
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
  }, [db])

  useEffect(() => {
    const getComments = async() => { 
      const commentCollection = collection.apply(null, colPath)
      const commentSnapshot = await getDocs(commentCollection);
      const commentArr = [];
      commentSnapshot.docs.forEach(async doc => {
        const contents = doc.data()
        commentArr.push(contents)
      })
      return commentArr
    }

    const commentSetter = async() => {
      try {
        setComments(await getComments())
      } catch(error) {
        console.error(error)
      }
    }
    commentSetter()
  }, [db, postId, colPath])

  return (
    <div>
      {
      post ?
       <>
        <SideBar topic={post.topic} />
        <div>
          <img src={post.img} />
        </div>
        <div>
          <div>{post.title}</div>
          <div>
            <button>{/* // TODO: put in the function to open/close this, maybe just toggle hide on this and have the small image mbe constant. but it also has to change the image of the button*/}collapse/expand button</button>
            <div>{post.timestamp}</div>
            <div>{post.userId}</div>
          </div>
          <div>
            <img />
          </div>
        </div>
      </>
      :
      null
      }
      <SubmitComment />
      {comments && comments.length > 0 ? comments.map(comment => <Comment key={uuidv4()} setColPath={setColPath} setTopComments={setComments} level={0} comment={ comment } db={db} prev={colPath}/>) : console.log(comments)}
    </div>
  )
}