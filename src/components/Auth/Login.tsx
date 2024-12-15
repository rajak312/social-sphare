import React from "react";
import Bg1 from "../../assets/bgImg1.png";
import Bg2 from "../../assets/bgImg2.png";
import Bg3 from "../../assets/bgImg3.png";
import Bg4 from "../../assets/bgImg4.png";
import Bg5 from "../../assets/bgImg5.png";
import Bg6 from "../../assets/bgImg6.png";
import Bg7 from "../../assets/bgImg7.png";
import Bg8 from "../../assets/bgImg8.png";
import Bg9 from "../../assets/bgImg9.png";
import Logo from "../../assets/logo.svg";
import { GoogleLogin } from "./GoogleLogin";
import { withDefaultLayout } from "../../hoc/withDefaulLayout";

const Login = () => {
  const images = [Bg1, Bg2, Bg3, Bg4, Bg5, Bg6, Bg7, Bg8, Bg9];

  return (
    <div className="h-full w-full relative ">
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          {images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              className="w-full"
              alt={`Background ${index + 1}`}
            />
          ))}
        </div>
        <div className="space-y-2">
          {images.slice(3, 6).map((image, index) => (
            <img
              className="w-full"
              key={index}
              src={image}
              alt={`Background ${index + 4}`}
            />
          ))}
        </div>
        <div className="space-y-2">
          {images.slice(6, 9).map((image, index) => (
            <img
              className="w-full"
              key={index}
              src={image}
              alt={`Background ${index + 7}`}
            />
          ))}
        </div>
      </div>
      <div className="bg-white shadow-xl border absolute -bottom-5 rounded-t-3xl w-full">
        <div className="relative w-full ">
          <div className="h-[300px] w-full  rounded-t-3xl bg-white flex justify-center flex-col gap-4 items-center">
            <div className="flex justify-center items-center flex-col">
              <div className="flex items-center text-2xl">
                <img src={Logo} alt="" />
                <h1 className="font-medium">Vibesnap</h1>
              </div>
              <p className="font-normal">
                Moments That Matter, Shared Forever.
              </p>
            </div>
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDefaultLayout(Login);
