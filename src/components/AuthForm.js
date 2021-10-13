import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { authService } from "fbase";
import { useState } from "react";

const AuthForm = () => {
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
  return (
    <>
      <form className="auth_form" onSubmit={onSubmit}>
        <input
          className="auth_input"
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          className="auth_input"
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          className="auth_submit"
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <span className="auth_error">{error}</span>}
      </form>
      <span className="auth_switch" onClick={toggledAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};
export default AuthForm;
