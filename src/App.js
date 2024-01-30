import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  getFirestore,
  getDocs,
  doc,
  collection,
  query,
  where,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import PostList from './components/post-list';
import NavBar from './components/nav';
import SubmitPage from './components/submission-page';
import SubmitLink from './components/submit-link';
import SubmitText from './components/submit-text';
import PostPage from './components/post-page';

function App() {
  const firebaseConfig = {
    apiKey: 'AIzaSyCgv64bQQZXvb0MmlcETVC2jzZ0p_-dCtY',
    authDomain: 'reddit-clone-ba823.firebaseapp.com',
    projectId: 'reddit-clone-ba823',
    storageBucket: 'reddit-clone-ba823.appspot.com',
    messagingSenderId: '244451787681',
    appId: '1:244451787681:web:5c48c268d82efcbe1681e0',
  };

  const [currentTopic, setCurrentTopic] = useState('all');
  const [userId, setUserId] = useState();
  const [isUserSignedIn, setIsUserSignedIn] = useState();

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const signIn = async () => {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  };

  const signOutUser = () => {
    // Sign out of Firebase.
    signOut(getAuth());
  };

  const getUserName = () => getAuth();

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      const { uid } = user;
      setUserId(uid);
      setIsUserSignedIn(!!user);
    } else {
      setIsUserSignedIn(false);
    }
  });

  const [posts, setPosts] = useState(null);

  const getPosts = async (uid, searchQuery = null, topic = 'all') => {
    // Gets posts under different circumstances (defaults to all if no topic is selected).
    const postArr = [];

    /* // TODO: let a user show posts from "subscribed" topics.
    would need to make a doc in the db to store each users subscriptions.
    then query for posts with that topic.
    annoying part would be rendering the subscription button to change if
    it's found within the users subs. */

    if (topic === 'all' && !searchQuery) {
      // Get all posts
      const q = query(collection(db, 'posts'));
      const postSnapshot = await getDocs(q);
      postSnapshot.docs.forEach(async (document) => {
        postArr.push(document.data());
      });
    } else if (topic === 'saved' && uid) {
      // Get saved posts for a specific user
      const q = query(doc(db, 'saved', uid));
      const postSnapshot = await getDoc(q);
      const { savedPosts } = postSnapshot.data();
      for (let i = 0; i < savedPosts.length; i + 1) {
        // eslint-disable-next-line no-await-in-loop
        const userData = await getDoc(postSnapshot.data().savedPosts[i]);
        if (userData.exists()) {
          postArr.push(userData.data()); // rename userData
        }
      }
    } else if (searchQuery) {
      // Get posts based on a search query
      const q = query(collection(db, 'posts'), where('title', '>=', searchQuery), where('title', '<=', `${searchQuery}\uf8ff`));
      const postSnapshot = await getDocs(q);
      postSnapshot.forEach((document) => {
        postArr.push(document.data());
      });
    } else {
      // Get posts based on a specific topic
      const q = query(collection(db, 'posts'), where('topic', '==', topic));
      const postSnapshot = await getDocs(q);
      postSnapshot.forEach((document) => {
        postArr.push(document.data());
      });
    }
    return postArr;
  };

  const postSetter = async (topic, uid, searchQuery = null) => {
    try {
      setPosts(await getPosts(topic, uid, searchQuery));
    } catch (error) {
      console.error(error);
    }
  };

  // Update the comment in the database with new upvote/downvote arrays and karma
  const updateDb = async (
    primaryArrName,
    secondaryArrName,
    primaryVoteArrCopy,
    secondaryVoteArrCopy,
    newParams,
  ) => {
    if (primaryArrName === 'upped') {
      const postUpdate = await doc(...newParams);
      await updateDoc(postUpdate, {
        [primaryArrName]: primaryVoteArrCopy,
        [secondaryArrName]: secondaryVoteArrCopy,
        karma: primaryVoteArrCopy.length - secondaryVoteArrCopy.length,
      });
    } else {
      const postUpdate = await doc(...newParams);
      await updateDoc(postUpdate, {
        [primaryArrName]: primaryVoteArrCopy,
        [secondaryArrName]: secondaryVoteArrCopy,
        karma: secondaryVoteArrCopy.length - primaryVoteArrCopy.length,
      });
    }
  };

  // Update the post/comment object with new upvote/downvote arrays and karma
  const updateObj = (
    primaryVoteArrCopy,
    primaryArrName,
    secondaryArrName,
    toBeUpdated,
    setToBeUpdated,
    secondaryVoteArrCopy = null,
  ) => {
    const clone = { ...toBeUpdated };
    clone[primaryArrName] = primaryVoteArrCopy;

    if (secondaryVoteArrCopy !== null) {
      clone[secondaryArrName] = secondaryVoteArrCopy;
    }

    clone.karma = clone.upped.length - clone.downed.length;
    setToBeUpdated(clone);
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="App" style={{ overflowAnchor: 'none' }}>
      <BrowserRouter>
        <NavBar
          topic={currentTopic}
          signIn={signIn}
          signOut={signOutUser}
          getUserName={getUserName}
          isUserSignedIn={isUserSignedIn}
        />
        <Routes>
          <Route path="/reddit-clone" element={<PostList posts={posts} db={db} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} setPosts={setPosts} setTopic={setCurrentTopic} postSetter={postSetter} />} />
          <Route path="/reddit-clone/topic/:topic" element={<PostList uid={userId} posts={posts} db={db} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} setTopic={setCurrentTopic} postSetter={postSetter} />} />
          <Route path="/reddit-clone/search/:searchQuery" element={<PostList uid={userId} posts={posts} db={db} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} setTopic={setCurrentTopic} postSetter={postSetter} />} />
          <Route path="/reddit-clone/post/:postId" element={<PostPage posts={posts} setPosts={setPosts} db={db} updateObj={updateObj} updateDb={updateDb} getUserName={getUserName} signIn={signIn} setTopic={setCurrentTopic} />} />
          <Route path="/reddit-clone/submit" element={<SubmitPage />} />
          <Route path="/reddit-clone/submit/submit-text" element={<SubmitText db={db} getUserName={getUserName} signIn={signIn} />} />
          <Route path="/reddit-clone/submit/submit-link" element={<SubmitLink db={db} getUserName={getUserName} signIn={signIn} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
