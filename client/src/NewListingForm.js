import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function NewListingForm({
  setDisplayForm,
  displayForm,
  listings,
  setListings,
  username,
  setUserListings,
  userListings,
  fetchUserListings,
}) {
  const history = useHistory();

  const [listingFormData, setListingFormData] = useState({
    title: "",
    content: "",
    image: "",
    user_id: username.id,
  });

  const styleObject = {
    row: {
      justifyContent: "center",
      display: "flex",
      flexDirection: "row",
      alightItems: "center",
    },

    input: {
      flex: 1,
      border: "none",
      borderRadius: 2,
      padding: 5,
    },

    label: {
      fontSize: "14px",
      color: "black",
      marginBottom: "2px",
    },

    group: {
      flex: 1,
      // padding: "10px",
      display: "flex",
      flexDirection: "column",
      margin: 5,
    },

    form: {
      borderRadius: 5,
      backgroundColor: "#e6e8ebd7",
      position: "relative",
      top: 125,
      marginRight: "25px",
      flex: 1,
      padding: "20px",
      alignItems: "center",
      marginLeft: 10,
    },

    textarea: {
      padding: 7,
      borderRadius: 5,
      border: "none",
      resize: "none",
      flex: 1,
      marginBottom: 25,
    },

    button: {
      marginLeft: 55,
      marginRight: 55,
      backgroundColor: "salmon",
      padding: 5,
      color: "white",
      border: "none",
      flex: 1,
      fontWeight: "bolder",
      borderRadius: 2,
    },

    header: {
      fontSize: 10,
      textAlign: "left",
      marginBottom: 25,
    },

    radioRow: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      marginBottom: 15,
      justifyContent: "left",
    },

    radioGroup: {
      size: 1,
      fontSize: 12,
      marginTop: 5,
      marginRight: 4,
    },

    radioInput: {
      position: "relative",
      top: 2,

      width: 10,
    },
  };

  function handleSubmit(e) {
    e.preventDefault();
    setDisplayForm(false);
    fetch("/listings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(listingFormData),
    })
      .then((res) => res.json())
      .then((new_listing) => {
        setListings([...listings, new_listing]);
        setUserListings([...userListings, new_listing]);
        fetchUserListings(username);
        console.log(username);
      });
  }

  return (
    <div className="listing_form_container">
      <form style={styleObject.form} onSubmit={handleSubmit}>
        <header style={styleObject.header}>
          <h1>New Listing</h1>
        </header>
        <div style={styleObject.row}>
          <div style={styleObject.group}>
            <label style={styleObject.label}>Title</label>
            <input
              style={styleObject.input}
              value={listingFormData.title}
              type="text"
              name="title"
              onChange={(e) =>
                setListingFormData({
                  ...listingFormData,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div style={styleObject.group}>
            <label style={styleObject.label}>Image</label>
            <input
              style={styleObject.input}
              value={listingFormData.image}
              type="text"
              name="image"
              onChange={(e) =>
                setListingFormData({
                  ...listingFormData,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div style={styleObject.radioRow}>
          <div style={styleObject.radioGroup}>
            <label for="For Sale">
              <input type="radio" name="type" style={styleObject.radioInput} />
              For Sale
            </label>
          </div>
          <div style={styleObject.radioGroup}>
            <label for="Wanted">
              <input
                type="radio"
                // style={styleObject.input}
                // value={listingFormData.type}
                name="type"
                style={styleObject.radioInput}
              />
              Wanted
            </label>
          </div>
          <div style={styleObject.radioGroup}>
            <label for="Free">
              <input type="radio" style={styleObject.radioInput} name="type" />
              Free
            </label>
          </div>
        </div>
        <div style={styleObject.row}>
          <textarea
            style={styleObject.textarea}
            placeholder="Listing details"
            value={listingFormData.content}
            type="text"
            name="content"
            rows={8}
            cols={50}
            onChange={(e) =>
              setListingFormData({
                ...listingFormData,
                [e.target.name]: e.target.value,
              })
            }
          />
        </div>
        <div style={styleObject.row}>
          <button style={styleObject.button}>Submit</button>
        </div>
      </form>
    </div>
  );
}
