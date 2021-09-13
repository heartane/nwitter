import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router";

const Profile = () => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
    //로그아웃은 되지만 링크는 profile이다.
    //home으로 가도록 Router에서 redirect설정
    //혹은 react hook인 useHistory()사용.
  );
};
export default Profile;
