import SignUpForm from "./SignupForm";
import "./App.css";
import Form from "./Form";
import ListingsContainer from "./ListingsContainer";
import { Switch, Route } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import NewListingForm from "./NewListingForm";
import FullListing from "./FullListing";
import NavBar from "./NavBar";
import Profile from "./Profile";

function App() {
  const [listings, setListings] = useState([]);
  const [username, setUsername] = useState();
  const [displayForm, setDisplayForm] = useState(false);
  const [displayCurrentListing, setDisplayCurrentListing] = useState(false);
  const [currentListing, setCurrentListing] = useState();
  const [comments, setComments] = useState([]);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          setUsername(user);
          fetchUserListings(user);
        });
      }
    });
  }, [listings, comments]);

  useEffect(() => {
    fetch("/listings")
      .then((res) => res.json())
      .then((data) => setListings(data));
  }, []);

  useEffect(() => {
    fetch("/comments")
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  const fetchUserListings = (user) => {
    fetch(`/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUserListings(data.listings));
  };

  return (
    <div className="App">
      <NavBar username={username} setUsername={setUsername} />
      <Switch>
        <Route exact path="/login">
          <Form className="userform" setUsername={setUsername} />
        </Route>
        <Route exact path="/signup">
          <div>
            <SignUpForm />
          </div>
        </Route>
        <Route exact path="/profile">
          <Profile
            setUsername={setUsername}
            username={username}
            listings={listings}
            setListings={setListings}
            userListings={userListings}
            setUserListings={setUserListings}
            fetchUserListings={fetchUserListings}
          />
        </Route>
        <Route exact path="/home">
          <div className="page_container">
            <ListingsContainer
              currentListing={currentListing}
              listings={listings}
              setDisplayForm={setDisplayForm}
              displayForm={displayForm}
              setDisplayCurrentListing={setDisplayCurrentListing}
              displayCurrentListing={displayCurrentListing}
              setCurrentListing={setCurrentListing}
              username={username}
            />
            {displayForm ? (
              <NewListingForm
                setDisplayCurrentListing={setDisplayCurrentListing}
                displayCurrentListing={displayCurrentListing}
                currentListing={currentListing}
                setDisplayForm={setDisplayForm}
                listings={listings}
                setListings={setListings}
                username={username}
                userListings={userListings}
                setUserListings={setUserListings}
                fetchUserListings={fetchUserListings}
              />
            ) : null}
            {displayCurrentListing ? (
              <FullListing
                currentListing={currentListing}
                comments={comments}
                setComments={setComments}
                listings={listings}
                setListings={setListings}
                username={username}
              />
            ) : null}
          </div>
        </Route>
        <Route></Route>
      </Switch>
    </div>
  );
}

export default App;
