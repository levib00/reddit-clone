import React, { useState } from "react";
import { SubmitPage } from "./submission-page";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'

export const SubmitLink = (props) => {
  const {db} = props

  const [selectedFile, setSelectedFile] = useState(undefined);
  const [titleInput, setTitleInput] = useState('')
  const [topicInput, setTopicInput] = useState('')

  async function handleFiles(files) {
    const file = files;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setSelectedFile(e.target.result)
    }
  }
  

  const submitPosts = async() => {
      await setDoc(doc(db, 'posts', uuidv4()), {
        img: selectedFile,
        karma: 0,
        timeStamp: serverTimestamp(),
        title: titleInput,
        topic: topicInput,
        userId: 'userid' //getAuth to put username here.
      });
  }

  return (
    <div>
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
        }}
        />
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