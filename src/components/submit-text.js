import React, { useState } from "react";
import { SubmitPage } from "./submission-page";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'

export const SubmitText = (props) => {
  const {db, getUserName} = props

  const [titleInput, setTitleInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [topicInput, setTopicInput] = useState('')

  const submitPosts = async() => {
      await setDoc(doc(db, 'posts', uuidv4()), {
        text: textInput,
        karma: 0,
        timeStamp: serverTimestamp(),
        title: titleInput,
        topic: topicInput,
        userId: await getUserName().currentUser.displayName //getAuth to put username here.
      });
  }

  return (
    <div>
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