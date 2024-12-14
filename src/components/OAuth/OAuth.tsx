import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";
import GoogleIcon from "../../assets/Google.svg";

const OAuth = () => {
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log("results", result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="border flex items-center gap-2 bg-white w-max p-4  rounded-full">
      <img src={GoogleIcon} alt="google_icon" width={25} height={25} />
      <p className="text-xl">Continue with Google</p>
    </button>
  );
};

export default OAuth;
