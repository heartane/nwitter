// import React from 'react';
import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 로그인 유무에 따라 다른 라우트 onAuthStateChanged()
    onAuthStateChanged(authService, (user) => {
      if (user) setUserObj(user);
      else setUserObj(null);
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLogin={Boolean(userObj)} userObj={userObj} />
      ) : (
        "initializing..."
      )}
      <footer>&copy; Copyright {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
