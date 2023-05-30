import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { 
  getFirestore, 
  getDocs, 
  doc, 
  setDoc, 
  collection, 
  serverTimestamp,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
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
import { LinkPostPage } from "./components/link-post-page";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCgv64bQQZXvb0MmlcETVC2jzZ0p_-dCtY",
    authDomain: "reddit-clone-ba823.firebaseapp.com",
    projectId: "reddit-clone-ba823",
    storageBucket: "reddit-clone-ba823.appspot.com",
    messagingSenderId: "244451787681",
    appId: "1:244451787681:web:5c48c268d82efcbe1681e0",
  };

  const [topic, setTopic] = useState('all')

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  function signOutUser() {
    // Sign out of Firebase.
    signOut(getAuth());
  }

  function getUserName() {
    return getAuth()
  }

  const [posts, setPosts] = useState(null)

  const getPosts = async(topic) => { 
    // Gets posts for selected topic (defaults to all if no topic is selected).
    const postArr = [];
    if (topic === 'all' || !topic) {
      const q = query(collection(db, "posts"))
      const postSnapshot = await getDocs(q);
      postSnapshot.docs.forEach(async doc => {
        postArr.push(doc.data())
      })
    } else {
      const q = query(collection(db, "posts"), where("topic", "==", topic));
      const postSnapshot = await getDocs(q);
      postSnapshot.forEach((doc) => {
        postArr.push(doc.data())
      });
    }
    return postArr
  }

  const postSetter = async(topic) => {
    try {
      setPosts(await getPosts(topic))
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <div className="App" style={{overflowAnchor: 'none'}}>
      <BrowserRouter>
        <NavBar topic={topic} signIn={signIn} signOut={signOutUser} getUserName={getUserName}/>
        <Routes>
          <Route path='/' element={<PostList posts={posts} db={db} signInWithPopup={signInWithPopup} getUserName={getUserName} setPosts={setPosts} setTopic={setTopic} postSetter={postSetter} />} />
          <Route path="/topic/:topic" element={<PostList posts={posts} db={db} signInWithPopup={signInWithPopup} getUserName={getUserName} setTopic={setTopic} postSetter={postSetter}  /> } />
          <Route path='/post/link/:postId' element={<LinkPostPage posts={posts} setPosts={setPosts} db={db} getUserName={getUserName} signInWithPopup={signInWithPopup} setTopic={setTopic}/>}/>
          <Route path='/submit' element={<SubmitPage />}/>
          <Route path='/submit/submit-text' element={<SubmitText db={db} getUserName={getUserName} signInWithPopup={signInWithPopup}/>}/>
          <Route path='/submit/submit-link' element={<SubmitLink db={db} getUserName={getUserName} signInWithPopup={signInWithPopup}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
