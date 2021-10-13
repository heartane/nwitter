import { authService } from "fbase";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { dbService } from "fbase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
  const [newDpName, setNewDpName] = useState(userObj.displayName);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDpName(value);
  };
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const getMyNweets = async () => {
    // Get multiple documents from a collection
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDpName) {
      await updateProfile(authService.currentUser, {
        displayName: newDpName,
      });
      refreshUser();
    }
  };

  return (
    <div className="profile_container">
      <form className="profile_form" onSubmit={onSubmit}>
        <input
          className="profile_input"
          type="text"
          placeholder="Display name"
          value={newDpName}
          onChange={onChange}
          autoFocus
        />
        <input
          className="profile_update"
          type="submit"
          value="Update Profile"
        />
      </form>
      <span className="profile_logout" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
export default Profile;
