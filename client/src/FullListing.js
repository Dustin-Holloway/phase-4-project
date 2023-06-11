import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Comment from "./Comment";

export default function FullListing({
  currentListing,
  comments,
  setComments,
  username,
}) {
  return (
    <div className="full_listing_container">
      <div className="listing_header">
        <h2>{currentListing.title}</h2>
        <p>{currentListing.content}</p>
      </div>
      <img style={{ width: 300, height: 200 }} src={currentListing.image} />
      <div className="comment_section">
        <Comment
          comments={comments}
          setComments={setComments}
          currentListing={currentListing}
          username={username}
        />
      </div>
    </div>
  );
}
