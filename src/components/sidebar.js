import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SideBar({ topic, mobile }) {
  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState('');

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className={mobile ? 'sidebar mobile-sidebar' : 'sidebar full-sidebar'}>
      {/* Input field for the search query */}
      <input className="search-bar" type="text" placeholder="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      {/* Link to perform the search using the search query */}
      <Link to={`/reddit-clone/search/${searchQuery}`}><button aria-label="search-button" className="search-button" /></Link>
      {/* Heading displaying the current topic or "all" if not specified */}
      {/* Link to submit a new link */}

      <h2>{topic || 'all'}</h2>
      {/* Text displaying the content being displayed based on the topic */}
      <div>
        displaying content
        {' '}
        {topic ? `on the topic of ${topic}` : 'from all topics'}
        .
      </div>
      <p>
        This is a personal project to practice web development,
        not a replacement/competitor to reddit. You can find the source code
        <a href="https://github.com/levib00/reddit-clone">here.</a>
      </p>
      <p>
        Please try to keep posts safe for work (no nudity,
        excessive violence, gore, hate speech, etc.)
      </p>
      <p>
        If you think a post or comment should be removed for violating any of the above rules,
        or because you own the copyright to any material please send an email
        to clonedditreport@gmail.com with a link to the post containing said content.
      </p>
      <Link to="/reddit-clone/submit/submit-link">
        <button className="link-to-submit">Submit a new link</button>
      </Link>
      {/* Link to submit a new text post */}
      <Link to="/reddit-clone/submit/submit-text">
        <button className="link-to-submit">Submit a new text post</button>
      </Link>
      <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Royyan Wijaya - Flaticon</a>
    </div>
  );
}
