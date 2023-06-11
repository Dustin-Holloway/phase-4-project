import React from "react";
import Listing from "./Listings";

function ListingsContainer({
  listings,
  setDisplayForm,
  displayForm,
  currentListing,
  setCurrentListing,
  setDisplayCurrentListing,
  displayCurrentListing,
}) {
  const listing_item = listings.map((listing) => (
    <Listing
      key={listing.id}
      listing={listing}
      currentListing={currentListing}
      setDisplayForm={setDisplayForm}
      displayForm={displayForm}
      setCurrentListing={setCurrentListing}
      setDisplayCurrentListing={setDisplayCurrentListing}
      displayCurrentListing={displayCurrentListing}
    />
  ));

  function handleDisplayForm(e) {
    if (displayCurrentListing) {
      setCurrentListing(null);
      setDisplayCurrentListing(false);
    }
    setDisplayForm(!displayForm);
  }

  return (
    <div className="listings_container">
      <h1 className="listings">Listings</h1>
      <h3 className="new_listing" onClick={handleDisplayForm}>
        Post new listing
      </h3>
      {listing_item}
    </div>
  );
}

export default ListingsContainer;
