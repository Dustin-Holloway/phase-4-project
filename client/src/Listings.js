import { useState, React } from "react";

function Listing({
  listing,
  setCurrentListing,
  currentListing,
  setDisplayForm,
  displayCurrentListing,
  setDisplayCurrentListing,
  displayForm,
}) {
  function handleClick(listing) {
    if (displayForm) {
      setDisplayForm(!setDisplayForm);
    }
    if (currentListing === listing) {
      setCurrentListing(null);
      setDisplayCurrentListing(false);
    } else {
      setCurrentListing(listing);
      setDisplayCurrentListing(true);
    }
  }

  return (
    <div
      className="listing"
      key={listing.id}
      onClick={(e) => handleClick(listing)}
    >
      <h4>{listing.title}</h4>
      {/* <p className="listing_content">{listing.content}</p> */}
    </div>
  );
}

export default Listing;
