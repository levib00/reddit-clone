import React, { useEffect, useState } from "react";
import { SubmitComment } from "./submit-comment";
import { Comment } from "./comment";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'
import { SideBar } from "./sidebar";
import { Post } from "./post";

export const LinkPostPage = ({ db, getUserName, signInWithPopup, setTopic, posts }) => {
  const { postId } = useParams()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState(null)
  const [colPath, setColPath] = useState([db, 'posts', postId, 'comments'])

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

  useEffect(() => { // TODO: see if i can combine this with the other useEffect && see if I can use DI to get rid of any of these getters
    const getPost = async() => { 
      const postRef = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postRef);
      const contents = postSnapshot.data()
      return contents
    }
    const postSetter = async() => {
      try {
        setPost(await getPost())
      } catch(error) {
        console.error(error)
      }
    }
    postSetter()
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
        <Post key={uuidv4()} signInWithPopup={signInWithPopup} posts={posts} setPosts={setPost} db={db} getUserName={getUserName} post={post} from={'post-page'} />
      </>
      :
      null
      }
      <SubmitComment getUserName={getUserName} signInWithPopup={signInWithPopup} dbPath={[db, 'posts', postId, 'comments']} postId={postId} db={db} comments={comments} setComments={setComments} />
      {comments && comments.length > 0 ? comments.map(comment => <Comment key={uuidv4()} setColPath={setColPath} setTopComments={setComments} level={0} getUserName={getUserName} postId={postId} signInWithPopup={signInWithPopup} comment={comment} db={db} prev={colPath}/>) : null}
    </div>
  )
}