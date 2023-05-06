import React from "react";
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
} from 'firebase/firestore'
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { initializeApp } from "firebase/app";
import { SideBar } from "./components/sidebar";
import { PostList } from "./components/post-list"
import { NavBar } from "./components/nav";
import { SubmitPage } from "./components/submission-page";
import { SubmitLink } from "./components/submit-link";
import { SubmitText } from "./components/submit-text";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCgv64bQQZXvb0MmlcETVC2jzZ0p_-dCtY",
    authDomain: "reddit-clone-ba823.firebaseapp.com",
    projectId: "reddit-clone-ba823",
    storageBucket: "reddit-clone-ba823.appspot.com",
    messagingSenderId: "244451787681",
    appId: "1:244451787681:web:5c48c268d82efcbe1681e0",
  };
  

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

  async function saveImageMessage(file) {
    try {
      // 1 - We add a message with a loading icon that will get updated with the shared image.
      const messageRef = await addDoc(collection(getFirestore(), 'messages'), {
        name: getUserName(),
        imageUrl: null,
        timestamp: serverTimestamp()
      });
  
      // 2 - Upload the image to Cloud Storage.
      const filePath = `${getAuth().currentUser.uid}/${messageRef.id}/${file.name}`;
      const newImageRef = ref(getStorage(), filePath);
      const fileSnapshot = await uploadBytesResumable(newImageRef, file);
      
      // 3 - Generate a public URL for the file.
      const publicImageUrl = await getDownloadURL(newImageRef);
  
      // 4 - Update the chat message placeholder with the image's URL.
      await updateDoc(messageRef,{
        imageUrl: publicImageUrl,
        storageUri: fileSnapshot.metadata.fullPath
      });
    } catch (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar username={'Username'} signIn={signIn} signOut={signOutUser} getUserName={getUserName}/>
        <SideBar />
        <Routes>
          <Route path='/' element={<PostList posts={[]} db={db}/>} />
          <Route path='/submit' element={<SubmitPage />}/>
          <Route path='/submit/submit-text' element={<SubmitText db={db} getUserName={getUserName}/>}/>
          <Route path='/submit/submit-link' element={<SubmitLink db={db} getUserName={getUserName}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
