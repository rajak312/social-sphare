import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { RootState } from "../store";
import { RiSendPlaneFill } from "react-icons/ri";
import SharePopup from "./SharePopup";

const FeedCard = () => {
  const { displayName, profilePictureUrl } = useSelector(
    (state: RootState) => state.user
  );

  const [likes, setLikes] = useState(69);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + (isLiked ? -1 : 1));
    setIsLiked((prevIsLiked) => !prevIsLiked);
  };

  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const url = window.location.href;

  return (
    <div className="w-full h-[341px] bg-purple-50 shadow hover:shadow-xl border flex flex-col justify-between rounded-lg p-4 transition-all duration-300">
      <div className="flex items-center gap-2">
        <img
          src={profilePictureUrl ?? undefined}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h6 className="font-semibold">{displayName}</h6>
          <small>2 hours ago</small>
        </div>
      </div>
      <small className="text-ellipsis line-clamp-3">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta
        voluptatum tempore cum quibusdam
      </small>
      <div className="overflow-x-auto flex h-[167px]">
        <img src={profilePictureUrl ?? undefined} alt="" width={200} />
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 font-medium ${
            isLiked ? "text-pink-700" : "text-gray-500"
          }`}>
          <FaHeart />
          {likes}
        </button>
        <div>
          <button
            onClick={handleShareClick}
            className="font-semibold flex items-center gap-2 bg-gray-200 rounded-full px-4 py-1">
            <RiSendPlaneFill className="text-lg" />
            Share
          </button>
        </div>
      </div>

      {isModalOpen && <SharePopup url={url} onClose={handleCloseModal} />}
    </div>
  );
};

export default FeedCard;
