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
  const [sortingOptions] = useState([{option : 'timeStamp', displayed: 'recent'},{option: 'karma', displayed: 'top'}])
  const [sortOption, setSortOption] = useState(sortingOptions[0])
  const [showDropDown, setShowDropDown] = useState(false)

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
    if (comments) {
      const commentsClone = [...comments]
      setComments(sortPosts(commentsClone, sortOption.option))
    }
  }, [sortOption])

  const handleSortSelect = (option) => {
    setSortOption(option)
    setShowDropDown(!showDropDown)
  }

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
        const commentsClone = [...await getComments()]
        setComments(sortPosts(commentsClone, sortOption.option))
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
      <div>
        <div onClick={() => setShowDropDown(!showDropDown)}>
          {sortOption.displayed}
          </div>
          {showDropDown ? 
           <div>
            {sortingOptions.map(option => sortOption.option === option.option ? null : <div key={uuidv4()} onClick={() => handleSortSelect(option)}>{option.displayed}</div>)}
           </div> 
           : 
          null}
        </div>
      {comments && comments.length > 0 ? comments.map(comment => <Comment key={uuidv4()} setColPath={setColPath} setTopComments={setComments} level={0} getUserName={getUserName} postId={postId} signInWithPopup={signInWithPopup} comment={comment} db={db} prev={colPath}/>) : null}
    </div>
  )
}