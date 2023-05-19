import React, { useEffect, useState } from "react";
import { SubmitComment } from "./submit-comment";
import { Comment } from "./comment";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'
import { SideBar } from "./sidebar";
import collapse from '../assets/collapse.png';
import expandImage from '../assets/expand-img.png';

export const LinkPostPage = ({ db, getUserName, signInWithPopup, setTopic }) => {
  const { postId } = useParams()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState(null)
  const [colPath, setColPath] = useState([db, 'posts', postId, 'comments'])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (post) {
      setTopic(post.topic)
    }
  }, [post, setTopic])

  useEffect(() => {
    return () => {
      setTopic('all')
    }
  }, [setTopic])

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
          <div> {/*maybe move background image of below button into css backgrounds */}
            <button onClick={() => setExpanded(!expanded)}>{ expanded ? <img src={collapse} alt="The letter X within a circle"/> : <img src={expandImage} alt="A play button"/>}</button>
            <div>{post.timestamp}</div>
            <div>{post.userId}</div>
          </div>
          <div>
            {expanded ? <img src={post.img}/> : null}
          </div>
        </div>
      </>
      :
      null
      }
      <SubmitComment getUserName={getUserName} signInWithPopup={signInWithPopup} dbPath={[db, 'posts', postId]} postId={postId} db={db} />
      {comments && comments.length > 0 ? comments.map(comment => <Comment key={uuidv4()} setColPath={setColPath} setTopComments={setComments} level={0} getUserName={getUserName} postId={postId} signInWithPopup={signInWithPopup} comment={comment} db={db} prev={colPath}/>) : null}
    </div>
  )
}