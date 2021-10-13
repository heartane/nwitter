import { authService } from "fbase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
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
    <div className="auth_container">
      <FontAwesomeIcon
        className=""
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="auth_social">
        <button className="auth_google" name="google" onClick={onSocialClick}>
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button className="auth_github" name="github" onClick={onSocialClick}>
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
