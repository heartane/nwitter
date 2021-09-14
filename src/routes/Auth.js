import React, { useState } from "react";
import { authService } from "fbase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const Auth = () => {
  // 상태를 기존 유저인 경우와 새로운 유저일 경우로 나눈다.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (e) => {
    // input이 변경될 때마다 onChange 발생
    // 어떤 event가 발생했니? -> input이 변경됐어.
    // 우리는 event객체에서 많은 정보를 받아올 수 있는데
    // 그중 하나의 정보가 target -> 변경이 일어난 부분에 대한 정보.
    // target에는 name(내가 부여한 것)과 value(키보드를 통해 입력된 값)가 있고
    // 그것을 통해 state를 변경하는 거지!
    console.log(e.target.name);
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  }; // onChange 2개 만들기 싫어서 그냥 name 준 것!
  const onSubmit = async (e) => {
    // submit 할 때마다 새로고침이 돼서 리액트 코드가 사라지지않게
    // 내가 컨트롤 할 수 있게 해줘! 내가 지시할거야!
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggledAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e; // 구조분해 할당 이런식으로도 가능하다!
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      }
      if (name === "github") {
        provider = new GithubAuthProvider();
      }
      await signInWithPopup(authService, provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error}
      </form>
      <span onClick={toggledAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};
export default Auth;
