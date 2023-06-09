import react, { useState } from "react";
import { Link } from "react-router-dom";


export const SideBar = ({ topic }) => {
  const [ searchQuery, setSearchQuery ] = useState('')

  return (
    <div>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      <Link to={`/search/${searchQuery}`}><button>search</button></Link>
      <h2>{topic || 'all'}</h2>
      <div>
        displaying content {topic ? `on the topic of ${topic}` : 'from all topics'}.
      </div>
      <Link to='/submit/submit-link'><button>Submit a new link</button></Link>
      <Link to='/submit/submit-text'><button>Submit a new text post</button></Link>
    </div>
  )
}