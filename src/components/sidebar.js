import react, { useState } from "react";
import { Link } from "react-router-dom";


export const SideBar = ({ topic }) => {
  // State to hold the search query
  const [ searchQuery, setSearchQuery ] = useState('')

  return (
    <div>
      {/* Input field for the search query */}
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      {/* Link to perform the search using the search query */}
      <Link to={`/search/${searchQuery}`}><button>search</button></Link>
      {/* Heading displaying the current topic or "all" if not specified */}
      <h2>{topic || 'all'}</h2>
      {/* Text displaying the content being displayed based on the topic */}
      <div>
        displaying content {topic ? `on the topic of ${topic}` : 'from all topics'}.
      </div>
       {/* Link to submit a new link */}
      <Link to='/submit/submit-link'>
        <button>Submit a new link</button>
      </Link>
      {/* Link to submit a new text post */}
      <Link to='/submit/submit-text'>
        <button>Submit a new text post</button>
      </Link>
    </div>
  )
}
