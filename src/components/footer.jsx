import React from 'react';

export default function Footer(props) {
  const { extend, loadNext } = props;

  return (
    <div className="footer">
      <div>
        {/* "Load more posts" button */}
        <button className="footer-button" onClick={extend}>load more posts</button>
      </div>
      or
      <div>
        {/* "Load the next page" button */}
        <button className="footer-button" onClick={loadNext}>load the next page</button>
      </div>
    </div>
  );
}
