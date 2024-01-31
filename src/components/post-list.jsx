import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import Post from './post';
import Footer from './footer';
import SideBar from './sidebar';

export default function PostList(props) {
  const {
    setTopic, postSetter, getUserName, db, signIn, uid, updateDb, updateObj, posts,
  } = props;
  // Extract topic or search query from url
  const { topic } = useParams();
  const { searchQuery } = useParams();

  // State variables
  const [renderedPosts, setRenderedPosts] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(25);
  const [username] = useState(getUserName());
  const [sortOption, setSortOption] = useState('timeStamp');
  const [start, setStart] = useState(0);
  const [openSidebar, setOpenSidebar] = useState(false);

  // Function to sort posts based on a given sort option
  const sortPosts = (unsortedPosts, currentSortOption) => {
    const sortedPosts = unsortedPosts.sort((a, b) => {
      if (b[currentSortOption] < a[currentSortOption]) {
        return -1;
      }
      if (b[currentSortOption] > a[currentSortOption]) {
        return 1;
      }
      return 0;
    });
    return sortedPosts;
  };

  useEffect(() => {
    if (posts) {
      const sortedPosts = [...posts];
      setRenderedPosts(sortPosts(sortedPosts, sortOption));
    }
  }, [posts, sortOption]);

  const handleSortButton = (currentSortOption) => {
    if (openSidebar) {
      setOpenSidebar(false);
    }
    setSortOption(currentSortOption);
  };

  // Set the topic extracted above
  useEffect(() => {
    if (topic) {
      setTopic(topic);
    } else {
      setTopic('all');
    }
  }, [topic, setTopic]);

  // Reset the topic when the component is unmounted
  useEffect(() => () => {
    setTopic('all');
  }, [setTopic]);

  // Fetch posts based on the topic, user ID, and search query
  useEffect(() => {
    postSetter(topic, uid, searchQuery);
  }, [topic, uid, searchQuery]);

  // Function to extend the number of posts displayed
  const extend = () => {
    setNumberOfPosts(numberOfPosts + 25);
    const newPosts = [...renderedPosts];
    for (let i = 0; i < numberOfPosts / 25; i + 1) {
      newPosts.splice(
        i * 25,
        0,
        <div key={uuidv4()}>
          Page
          {i}
        </div>,
      );
    }
    setRenderedPosts(newPosts);
  };

  // Function to load the next set of posts
  const loadNext = () => {
    setNumberOfPosts(numberOfPosts + 25);
    setStart(start + 25);
  };

  return (
    <div className="post-list-page">
      <SideBar topic={topic} mobile={false} />
      {openSidebar && <SideBar topic={topic} mobile />}
      <div className="post-list">
        {/* Sorting options */}
        <div className="sort-post-list">
          <button className={!openSidebar && sortOption === 'timeStamp' ? 'sort-button selected-sort' : 'sort-button'} onClick={() => handleSortButton('timeStamp')}>new</button>
          <button className={!openSidebar && sortOption === 'karma' ? 'sort-button selected-sort' : 'sort-button'} onClick={() => handleSortButton('karma')}>top</button>
          <button className={openSidebar ? 'open-sidebar sort-button selected-sort ' : 'open-sidebar sort-button'} onClick={() => setOpenSidebar(!openSidebar)}>sidebar</button>
        </div>
        {/* Render posts */}
        {!openSidebar
        && (
        <>
          {
            renderedPosts ? renderedPosts.slice(start, numberOfPosts).map((post, index) => ((
              React.isValidElement(post)
            ) ? post : (
              <Post
                key={uuidv4()}
                index={index}
                posts={renderedPosts}
                setRenderedPosts={setRenderedPosts}
                db={db}
                username={username}
                updateObj={updateObj}
                updateDb={updateDb}
                signIn={signIn}
                getUserName={getUserName}
                post={post}
                from="post-list"
              />
              ))) : null
          }
          {(
            renderedPosts.length > numberOfPosts
          ) ? <Footer extend={extend} loadNext={loadNext} /> : null}
        </>
        )}
      </div>
    </div>
  );
}
