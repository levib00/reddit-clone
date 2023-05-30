import React, { useState } from "react";
import { SubmitPage } from "./submission-page";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'
import { SignInModal } from "./sign-in-prompt";

export const SubmitText = (props) => {
  const {db, getUserName, signInWithPopup} = props

  const [titleInput, setTitleInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [topicInput, setTopicInput] = useState('')
  const [showSignIn, setShowSignIn] = useState(false)

  const submitPosts = async() => {
    const username = await getUserName().currentUser.displayName
    if (username !== null) {
      const postId = uuidv4()
      await setDoc(doc(db, 'posts', postId), {
        text: textInput,
        karma: 0,
        upped: [],
        downed: [],
        timeStamp: serverTimestamp(),
        title: titleInput,
        topic: topicInput,
        userId: username,
        id: postId
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
        <label>title</label>
        <textarea onChange={(e) => {setTitleInput(e.target.value)}} value={titleInput}></textarea>
      </div>
      <div>
        <label>text</label>
        <textarea onChange={(e) => {setTextInput(e.target.value)}} value={textInput}></textarea>
      </div>
      <div>
        <label>topic</label>
        <input type="text" onChange={(e) => {setTopicInput(e.target.value)}} value={topicInput}></input>
      </div>
      <div>
        anything is saved and is subject to be removed at any time for any reason.
      </div>
      <button onClick={submitPosts}>Submit</button>
    </div>
  )
}