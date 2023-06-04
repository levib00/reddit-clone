import React, { useState } from "react";
import { SubmitPage } from "./submission-page";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";

export const SubmitLink = (props) => {
  const {db, getUserName, signInWithPopup} = props

  const [selectedFile, setSelectedFile] = useState(undefined);
  const [titleInput, setTitleInput] = useState('')
  const [topicInput, setTopicInput] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)

  async function handleFiles(files) {
    const file = files;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setSelectedFile(e.target.result)
    }
  }

  const submitPosts = async() => {
    const username = await getUserName().currentUser.displayName
    if (username !== null) {
      const postId = uuidv4()
      await setDoc(doc(db, 'posts', postId), {
        img: selectedFile,
        karma: 0,
        timeStamp: serverTimestamp(),
        title: titleInput,
        topic: topicInput,
        userId: username,
        id: postId,
        upped: [],
        downed: [],
        saved: [],
        isDeleted: false,
        uid: username.currentUser.uid
      });
    } else {
      setShowSignIn(true)
    }
  }

  return (
    <div>
      {showSignIn ? <SignInModal setShowSignIn={setShowSignIn} signInWithPopup={signInWithPopup} from={'submit a post'}/> : null}
      <SubmitPage />
      <div>
        <label>url</label>
        <input type="text"></input>
      </div>
      <div>
        <label>image/video</label>
        <input
         type="file" accept="video/*, image/*"
         onChange={(e) => {
          handleFiles(e.target.files[0])
          setSelectedFile(e.target.files[0])
        }}/>
      </div>
      <div>
        <label>title</label>
        <textarea onChange={(e) => {setTitleInput(e.target.value)}} value={titleInput}></textarea>
      </div>
      <div>
        <label>topic</label>
        <input type="text" onChange={(e) => {setTopicInput(e.target.value)}} value={topicInput}></input>
      </div>
      <div>
        anything is saved and is subject to be removed at any time for any reason.
      </div>
      <button onClick={() => {
        submitPosts()
      }}>Submit</button>
    </div>
  )
}