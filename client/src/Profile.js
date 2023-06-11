import React from "react";

export default function Profile({
  username,
  listings,
  setListings,
  userListings,
  setUserListings,
}) {
  console.log(username);

  function handleDelete(listing_id) {
    fetch(`/listings/${listing_id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setListings((listings) =>
          listings.filter((listing) => listing.id !== listing_id)
        );
        setUserListings((userListings) =>
          userListings.filter((listing) => listing.id !== listing_id)
        );
      }
    });
  }

  if (!username) {
    // Handle the case when the user object is undefined or null
    return <div>Loading...</div>; // or any other loading indicator
  }
  const list_of_listings = userListings.map((listing) => (
    <li key={listing.id} className="userListings">
      {listing.title}
      <button>edit</button>
      <button onClick={(e) => handleDelete(listing.id)}>delete</button>
    </li>
  ));

  return (
    <div className="container">
      <div className="dashboard">
        <div className="pic_container">
          <img src={username.image} />
        </div>
        <span></span>
        <h3>{username.id}</h3>
      </div>
      <div className="profile_body">
        <h2>{username.username}</h2>
        <ul>{list_of_listings}</ul>
      </div>
      <div className="latest_posting"></div>
      <div className="friends"></div>
    </div>
  );
}
