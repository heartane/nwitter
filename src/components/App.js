// import React from 'react';
import { useEffect, useState } from "react";
import AppRouter from "components/Router"; // 절대경로
// import AppRouter from './Router'; // 상대경로
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLogin, setIsLogin] = useState(false); // 로그인 유무를 모른다!
  useEffect(() => {
    // 로그인 유무에 따라 다른 라우트를 주려면 onAuthStateChanged()필요!
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
      setInit(true);
    });
  }, [isLogin]);
  return (
    <>
      {init ? <AppRouter isLogin={isLogin} /> : "initializing..."}
      <footer>&copy; Copyright {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
