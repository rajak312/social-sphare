import { GoogleLogin } from "./GoogleLogin";
import LogInImg from "../../assets/loginUser.jpg";

const LogIn = () => {
  return (
    <div className="h-full relative w-full flex justify-between caret-inherit flex-col">
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <img src={LogInImg} alt="" />
          <img src={LogInImg} alt="" />
          <img src={LogInImg} alt="" />
        </div>
        <div className="space-y-2">
          <img src={LogInImg} alt="" />
          <img src={LogInImg} alt="" />
          <img src={LogInImg} alt="" />
        </div>
        <div className="space-y-2">
          <img src={LogInImg} alt="" />
          <img src={LogInImg} alt="" />
          <img src={LogInImg} alt="" />
        </div>
      </div>
      <div className="h-[320px] w-full absolute bottom-0  rounded-t-[100px] bg-white  flex justify-center items-center">
        <GoogleLogin />
      </div>
    </div>
  );
};

export default LogIn;
