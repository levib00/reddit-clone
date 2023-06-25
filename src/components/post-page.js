import React, { useEffect, useState, useMemo } from "react";
import { SubmitComment } from "./submit-comment";
import { Comment } from "./comment";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'
import { SideBar } from "./sidebar";
import { Post } from "./post";

export const PostPage = ({ db, getUserName, signIn, setTopic, posts, updateDb, updateObj }) => {
  const { postId } = useParams()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState(null)
  const [colPath, setColPath] = useState([db, 'posts', postId, 'comments'])
  const sortingOptions = [{option : 'timeStamp', displayed: 'recent'},{option: 'karma', displayed: 'top'}]
  const [sortOption, setSortOption] = useState(sortingOptions[0])
  const [showDropDown, setShowDropDown] = useState(false)
  const [isExpandedThread, setIsExpandedThread] = useState(false)

  // Set the topic to the posts corresponding topic
  useEffect(() => {
    if (post) {
      setTopic(post.topic)
    }
  }, [post, setTopic])

  // Set topic to all when unmounting
  useEffect(() => {
    return () => {
      setTopic('all')
    }
  }, [setTopic])

  // Sort the comments based on the selected sorting option
  const sortComments = (posts, sortOption) => {
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

  // Rerender comments in sorted order when sort option changes
  useEffect(() => {
    if (comments) {
      const commentsClone = [...comments]
      setComments(sortComments(commentsClone, sortOption.option))
    }
  }, [sortOption.option])

  // Handle the selection of a sorting option
  const handleSortSelect = (option) => {
    setSortOption(option)
    setShowDropDown(!showDropDown)
  }

  // Gets and sets current post from database on page load
  useEffect(() => {
    // Retrieve the post data from the database
    const getPost = async() => { 
      const postRef = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postRef);
      const contents = postSnapshot.data()
      return contents
    }

    const postSetter = async() => {
      try {
        setPost(await getPost(colPath))
      } catch(error) {
        console.error(error)
      }
    }

    postSetter()
  }, [db])

  // Gets top level comments from database (nested comments will be gotten in comment component)
  const getComments = async(colPath) => { 
    const commentCollection = collection.apply(null, colPath)
    const commentSnapshot = await getDocs(commentCollection);
    const commentArr = [];
    commentSnapshot.docs.forEach(async doc => {
      const contents = doc.data()
      commentArr.push(contents)
    })
    return commentArr
  }

  // Sets top level comments in state to be rendered
  useEffect(() => {
    const commentSetter = async(colPath) => {
      try {
        const commentsClone = [...await getComments(colPath)]
        setComments(sortComments(commentsClone, sortOption.option))
      } catch(error) {
        console.error(error)
      }
    }
    commentSetter(colPath)
  }, [db, postId, colPath])

  const generateComments = (comments) => {
    if (comments && comments.length > 0) {
      const array = comments.map(comment => 
        <Comment key={uuidv4()} setIsExpandedThread={setIsExpandedThread} getComments={getComments} setColPath={setColPath} setTopComments={setComments} updateObj={updateObj} updateDb={updateDb} level={0} getUserName={getUserName} postId={postId} signInWithPopup={signIn} comment={comment} db={db} prev={colPath}/>
      )
      return <>{array}</>
    }
    <div>There are no comments</div>
  }

  const mainArea = useMemo(() => post ? <Post key={uuidv4()} signIn={signIn} posts={posts} updateObj={updateObj} updateDb={updateDb} setPosts={setPost} db={db} getUserName={getUserName} post={post} from={'post-page'} /> : <div>Loading</div>, [post]);
  const commentsList = useMemo(() => generateComments(comments), [comments])
  
  return (
    <div className={"post-page"}>
      {post ?
        <>
          <SideBar topic={post.topic} />
          {mainArea}
        </>
        : null
      }
      {/* Submit Comment form */}
      <div className="comments-section">
      <div className="dotted-separator"></div>
        {/* Sort dropdown */}
        <div className="sort-comments" >
          sorted by: <span className="current-sort" onClick={() => setShowDropDown(!showDropDown)}>{sortOption.displayed}</span>
          {/* Sorting options (only shows options that aren't already selected) */}
          {showDropDown ? 
            <div className="sort-dropdown">
              {sortingOptions.map(option => sortOption.option === option.option ? null : <div className="sort-option" key={uuidv4()} onClick={() => handleSortSelect(option)}>{option.displayed}</div>)}
            </div> 
          : null}
        </div>
        <SubmitComment getUserName={getUserName} signInWithPopup={signIn} dbPath={[db, 'posts', postId, 'comments']} postId={postId} db={db} comments={comments} setComments={setComments} />
        {isExpandedThread ? <div className="return-to-thread-button" onClick={() => {
          setIsExpandedThread(false);
          setColPath([db, 'posts', postId, 'comments'])
        }}>return to thread	<div className="return-indicator">→</div></div> : null}
          {/* Render comments */}
          {commentsList}
      </div>
    </div>
  )
}