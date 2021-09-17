// import React from 'react';
import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 로그인 유무에 따라 다른 라우트 onAuthStateChanged()
    onAuthStateChanged(authService, async (user) => {
      if (user) {
        if (!user.displayName) {
          const end = user.email.indexOf("@");
          const userId = user.email.substring(0, end);
          await updateProfile(user, { displayName: userId });
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        });
      } else setUserObj(null);
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          isLogin={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "initializing..."
      )}
      <footer>&copy; Copyright {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
