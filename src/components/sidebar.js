import React, { useEffect, useState } from "react";
import { getFirestore, getDocs, doc, setDoc, collection } from 'firebase/firestore'
import { initializeApp } from "firebase/app";
import { Link } from "react-router-dom";


export const SideBar = () => {
  
  return (
    <div>
      <h2>all</h2>
      <div>
        displaying content from all topics.
      </div>
      <Link to='/submit/submit-link'><button>Submit a new link</button></Link>
      <Link to='/submit/submit-text'><button>Submit a new text post</button></Link>
    </div>
  )
}