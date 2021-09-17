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
  }, []);

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
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          value={newDpName}
          onChange={onChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
    //로그아웃은 되지만 링크는 profile이다.
    //home으로 가도록 Router에서 redirect설정
    //혹은 react hook인 useHistory()사용.
  );
};
export default Profile;
