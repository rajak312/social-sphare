import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from "../../assets/Google.svg";
import { app } from "../../firebase";

export const GoogleLogin = () => {
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      await signInWithPopup(auth, provider);
      console.info("Successfully login with google Provider");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="border flex items-center gap-2 bg-gray-900 text-white w-max p-4 h-[50px]  rounded-full "
    >
      <img src={GoogleIcon} alt="google_icon" width={25} height={25} />
      <p className="text-xl">Continue with Google</p>
    </button>
  );
};
