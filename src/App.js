import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  getFirestore, 
  getDocs, 
  doc,
  collection,
  query,
  where,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { PostList } from "./components/post-list"
import { NavBar } from "./components/nav";
import { SubmitPage } from "./components/submission-page";
import { SubmitLink } from "./components/submit-link";
import { SubmitText } from "./components/submit-text";
import { PostPage } from "./components/post-page";

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyCgv64bQQZXvb0MmlcETVC2jzZ0p_-dCtY",
    authDomain: "reddit-clone-ba823.firebaseapp.com",
    projectId: "reddit-clone-ba823",
    storageBucket: "reddit-clone-ba823.appspot.com",
    messagingSenderId: "244451787681",
    appId: "1:244451787681:web:5c48c268d82efcbe1681e0",
  };

  const [topic, setTopic] = useState('all')
  const [uid, setUid] = useState()
  const [isUserSignedIn, setIsUserSignedIn] = useState()

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const signIn = async() => {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  const signOutUser = () => {
    // Sign out of Firebase.
    signOut(getAuth());
  }

  const getUserName = () => getAuth()

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      const uid = user.uid;
      setUid(uid)
      setIsUserSignedIn(!!user)
    } else {
      setIsUserSignedIn(false)
    }
  });

  const [posts, setPosts] = useState(null)

  const getPosts = async(topic = 'all', uid, searchQuery = null) => { 
    // Gets posts under different circumstances (defaults to all if no topic is selected).
    const postArr = [];
  
    if (topic === 'all' && !searchQuery ) {
      // Get all posts
      const q = query(collection(db, "posts"))
      const postSnapshot = await getDocs(q);
      postSnapshot.docs.forEach(async doc => {
        postArr.push(doc.data())
      })
    } else if (topic === 'saved' && uid) {
      // Get saved posts for a specific user
      const q = query(doc(db, "saved", uid))
      const postSnapshot = await getDoc(q);
      const savedPosts = postSnapshot.data().savedPosts
      for (let i = 0; i < savedPosts.length; i++) {
        let userData = await getDoc(postSnapshot.data().savedPosts[i]);
        if(userData.exists()) {
          postArr.push(userData.data()) //rename userData
        }
      }
    } else if (searchQuery) {
      // Get posts based on a search query
      const q = query(collection(db, "posts"), where('title', '>=', searchQuery), where('title', '<=', searchQuery + '\uf8ff'));
      const postSnapshot = await getDocs(q);
      postSnapshot.forEach((doc) => {
        postArr.push(doc.data())
      });
    } else {
      // Get posts based on a specific topic
      const q = query(collection(db, "posts"), where("topic", "==", topic));
      const postSnapshot = await getDocs(q);
      postSnapshot.forEach((doc) => {
        postArr.push(doc.data())
      });
    }
    return postArr
  }

  const postSetter = async(topic, uid, searchQuery = null) => {
    try {
      setPosts(await getPosts(topic, uid, searchQuery))
    } catch(error) {
      console.error(error)
    }
  }

  // Update the comment in the database with new upvote/downvote arrays and karma
  const updateDb = async(primaryArrName, secondaryArrName, primaryVoteArrCopy, secondaryVoteArrCopy, newParams) => {
    if (primaryArrName === 'upped') {
      const postUpdate = await doc.apply(null, newParams)
      await updateDoc(postUpdate, {
        [primaryArrName]: primaryVoteArrCopy,
        [secondaryArrName]: secondaryVoteArrCopy,
        karma: primaryVoteArrCopy.length - secondaryVoteArrCopy.length
      });
    } else {
      const postUpdate = await doc.apply(null, newParams)
      await updateDoc(postUpdate, {
        [primaryArrName]: primaryVoteArrCopy,
        [secondaryArrName]: secondaryVoteArrCopy,
        karma: secondaryVoteArrCopy.length - primaryVoteArrCopy.length
      });
    }
  }

  // Update the post/comment object with new upvote/downvote arrays and karma
  const updateObj = (primaryVoteArrCopy, secondaryVoteArrCopy = null, primaryArrName, secondaryArrName, toBeUpdated, setToBeUpdated) => {
    const clone = {...toBeUpdated} // ! reused in post
    clone[primaryArrName] = primaryVoteArrCopy

    if (secondaryVoteArrCopy !== null) {
      clone[secondaryArrName] = secondaryVoteArrCopy
    }
    
    clone.karma = clone.upped.length - clone.downed.length
    setToBeUpdated(clone)
  }

  return (
    <div className="App" style={{overflowAnchor: 'none'}}>
      <BrowserRouter>
        <NavBar topic={topic} signIn={signIn} signOut={signOutUser} getUserName={getUserName} isUserSignedIn={isUserSignedIn}/>
        <Routes>
          <Route path='/' element={<PostList posts={posts} db={db} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} setPosts={setPosts} setTopic={setTopic} postSetter={postSetter} />} />
          <Route path="/topic/:topic"  element={<PostList uid={uid} posts={posts} db={db} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} setTopic={setTopic} postSetter={postSetter} /> } />
          <Route path="/search/:searchQuery"  element={<PostList uid={uid} posts={posts} db={db} updateObj={updateObj} updateDb={updateDb} signIn={signIn} getUserName={getUserName} setTopic={setTopic} postSetter={postSetter} /> } />
          <Route path='/post/:postId' element={<PostPage posts={posts} setPosts={setPosts} db={db} updateObj={updateObj} updateDb={updateDb} getUserName={getUserName} signInWithPopup={signInWithPopup} setTopic={setTopic}/>}/>
          <Route path='/submit' element={<SubmitPage />}/>
          <Route path='/submit/submit-text' element={<SubmitText db={db} getUserName={getUserName} signIn={signIn}/>}/>
          <Route path='/submit/submit-link' element={<SubmitLink db={db} getUserName={getUserName} signIn={signIn}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
