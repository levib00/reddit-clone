/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection, doc, getDoc, getDocs,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Comment from './comment';
import SubmitComment from './submit-comment';
import SideBar from './sidebar';
import Post from './post';

export default function PostPage({
  db, getUserName, signIn, setTopic, posts, updateDb, updateObj,
}) {
  const { postId } = useParams();

  const [renderedPost, setRenderedPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [colPath, setColPath] = useState([db, 'posts', postId, 'comments']);
  const sortingOptions = [{ option: 'timeStamp', displayed: 'recent' }, { option: 'karma', displayed: 'top' }];
  const [sortOption, setSortOption] = useState(sortingOptions[0]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [isExpandedThread, setIsExpandedThread] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  // Set the topic to the posts corresponding topic
  useEffect(() => {
    if (renderedPost) {
      setTopic(renderedPost.topic);
    }
  }, [renderedPost, setTopic]);

  // Set topic to all when unmounting
  useEffect(() => () => {
    setTopic('all');
  }, [setTopic]);

  // Sort the comments based on the selected sorting option
  const sortComments = (unsortedComments, currentSortOption) => {
    const sortedComments = unsortedComments.sort((a, b) => {
      if (b[currentSortOption] < a[currentSortOption]) {
        return -1;
      }
      if (b[currentSortOption] > a[currentSortOption]) {
        return 1;
      }
      return 0;
    });
    return sortedComments;
  };

  // Rerender comments in sorted order when sort option changes
  useEffect(() => {
    if (comments) {
      const commentsClone = [...comments];
      setComments(sortComments(commentsClone, sortOption.option));
    }
  }, [sortOption.option]);

  // Handle the selection of a sorting option
  const handleSortSelect = (option) => {
    setSortOption(option);
    setShowDropDown(!showDropDown);
  };

  // Gets and sets current post from database on page load
  useEffect(() => {
    // Retrieve the post data from the database
    const getPost = async () => {
      const postRef = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postRef);
      const contents = postSnapshot.data();
      return contents;
    };

    const postSetter = async () => {
      try {
        setRenderedPost(await getPost(colPath));
      } catch (error) {
        console.error(error);
      }
    };

    postSetter();
  }, [db]);

  // Gets top level comments from database (nested comments will be gotten in comment component)
  const getComments = async (collectionPath) => {
    const commentCollection = collection(...collectionPath);
    const commentSnapshot = await getDocs(commentCollection);
    const commentArr = [];
    commentSnapshot.docs.forEach(async (commentDoc) => {
      const contents = commentDoc.data();
      commentArr.push(contents);
    });
    return commentArr;
  };

  const treeifyComments = async (collectionPath) => {
    const untreedComments = await getComments(collectionPath);
    const commentsClone = [...untreedComments];

    for (let i = 0; i < commentsClone.length; i += 1) {
      if (commentsClone[i].parentId) {
        for (let j = 0; j < commentsClone.length; j += 1) {
          if (!commentsClone[j].child || commentsClone[j].child.constructor !== Array) {
            commentsClone[j].child = [];
          }
          if (commentsClone[i].parentId === commentsClone[j].commentId) {
            commentsClone[j].child.unshift(commentsClone[i]);
          }
        }
      }
    }
    return commentsClone;
  };

  // Sets top level comments in state to be rendered
  useEffect(() => {
    const commentSetter = async (collectionPath) => {
      try {
        const commentsClone = [...await treeifyComments(collectionPath)];
        setComments(sortComments(commentsClone, sortOption.option));
      } catch (error) {
        console.error(error);
      }
    };
    commentSetter(colPath);
  }, [db, postId, colPath]);

  const generateComments = (commentTree) => {
    if (commentTree && commentTree.length > 0) {
      const array = commentTree.map((comment) => {
        let newComment;
        if (!comment.parentId) {
          newComment = (
            <Comment
              key={uuidv4()}
              setIsExpandedThread={setIsExpandedThread}
              comments={comments}
              setColPath={setColPath}
              setComments={setComments}
              updateObj={updateObj}
              updateDb={updateDb}
              level={0}
              getUserName={getUserName}
              postId={postId}
              signInWithPopup={signIn}
              comment={comment}
              db={db}
              colPath={colPath}
              child={comment.child}
            />
          );
        }
        return newComment;
      });
      return array;
    }
    return <div>There are no comments</div>;
  };

  const mainArea = useMemo(() => (renderedPost ? <Post key={uuidv4()} signIn={signIn} posts={posts} updateObj={updateObj} updateDb={updateDb} setComments={setComments} db={db} getUserName={getUserName} post={renderedPost} from="post-page" /> : <div>Loading</div>), [renderedPost]);

  return (
    <div className="post-page">
      <div className="sort-post-list">
        <button className={openSidebar ? 'open-sidebar sort-button selected-sort ' : 'open-sidebar sort-button'} onClick={() => setOpenSidebar(!openSidebar)}>sidebar</button>
      </div>
      {renderedPost
        ? (
          <>
            <SideBar topic={renderedPost.topic} />
            {openSidebar && <SideBar topic={renderedPost.topic} mobile />}
            {mainArea}
          </>
        )
        : null}
      {/* Submit Comment form */}
      <div className="comments-section">
        <div className="dotted-separator" />
        {/* Sort dropdown */}
        <div className="sort-comments">
          sorted by:
          {' '}
          <button className="current-sort" onClick={() => setShowDropDown(!showDropDown)}>{sortOption.displayed}</button>
          {/* Sorting options (only shows options that aren't already selected) */}
          {showDropDown
            ? (
              <div className="sort-dropdown">
                {sortingOptions.map((option) => (sortOption.option === option.option ? null : <button className="sort-option" key={uuidv4()} onClick={() => handleSortSelect(option)}>{option.displayed}</button>))}
              </div>
            )
            : null}
        </div>
        <SubmitComment getUserName={getUserName} signInWithPopup={signIn} dbPath={[db, 'posts', postId, 'comments']} postId={postId} db={db} comments={comments} setComments={setComments} parentId={null} />
        {isExpandedThread ? (
          <button
            className="return-to-thread-button"
            onClick={() => {
              setIsExpandedThread(false);
              setColPath([db, 'posts', postId, 'comments']);
            }}
          >
            return to thread
            <div className="return-indicator">→</div>
          </button>
        ) : null}
        {/* Render comments */}
        {generateComments(comments)}
      </div>
    </div>
  );
}
