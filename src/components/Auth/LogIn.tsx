import React from "react";
import { GoogleLogin } from "./GoogleLogin";
import LogInImg from "../../assets/loginUser.jpg";

interface LogInProps {
  onClose?: () => void;
}

const LogIn: React.FC<LogInProps> = ({ onClose }) => {
  return (
    // Modal backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Modal content container */}
      <div
        className="relative w-full max-w-md rounded-t-3xl bg-white overflow-hidden transform transition-all ease-in-out duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="h-full w-full flex flex-col caret-inherit">
          {/* Image grid section */}
          <div className="grid grid-cols-3 gap-2 p-4">
            {[...Array(3)].map((_, colIndex) => (
              <div className="space-y-2" key={colIndex}>
                {[...Array(3)].map((_, rowIndex) => (
                  <img key={rowIndex} src={LogInImg} alt="Login Preview" />
                ))}
              </div>
            ))}
          </div>

          {/* Google Login area */}
          <div className="h-[320px] w-full rounded-t-[100px] bg-white flex justify-center items-center">
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
