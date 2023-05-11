import React, { useEffect, useState } from "react";
import { SubmitComment } from "./commentSubmission";
import { Comment } from "./comment";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'

export const LinkPostPage = ({ db }) => {
  const { postId } = useParams()
  const [comments, setComments] = useState(null)
  const [colPath] = useState([db, 'posts', postId, 'comments'])

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

    const characterSetter = async() => {
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
      <div>
        <img alt="scaled down image"/>
      </div>
      <div>
        <div>title</div>
        <div>
          <button>collapse/expand button</button>
          <div>timestamp</div>
          <div>user</div>
        </div>
        <div>
          <img alt="scaled up image that can be collapsed by a button"/>
        </div>
      </div>
      <SubmitComment />
      {comments ? comments.map(comment => <Comment key={uuidv4()} comment={ comment } db={db} prev={colPath}/>) : null}
    </div>
  )
}