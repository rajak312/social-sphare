import React from "react";
import { FaHeart } from "react-icons/fa";
import BgImg from "../assets/loginUser.jpg";

const MyPostCard = () => {
  return (
    <div className="w-full h-full min-h-[200px] max-h-[240x] bg-white border shadow-xl  overflow-hidden rounded-xl relative">
      <img src={BgImg} alt="" className="w-full h-full object-fill" />
      <div className="absolute bottom-4 left-2">
        <h6 className="text-white font-bold">Design Meet</h6>
        <div className="flex text-gray-500 font-medium items-center gap-2">
          <FaHeart />
          69
        </div>
      </div>
    </div>
  );
};

export default MyPostCard;
