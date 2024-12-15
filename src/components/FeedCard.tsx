import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { RootState } from "../store";
import { RiSendPlaneFill } from "react-icons/ri";
import SharePopup from "./SharePopup";
import { Like, PostWithRelations } from "../utils/types";
import { supabase } from "../supabase";

export interface FeedCardProps {
  post: PostWithRelations;
}

const FeedCard = ({ post }: FeedCardProps) => {
  const { displayName, profilePictureUrl, id } = useSelector(
    (state: RootState) => state.user
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLiked = !!post.likes.find((user) => user.id === id);

  const toggleLike = async () => {
    try {
      const { data: existingLike, error: fetchError } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", id)
        .single();

      console.log("existing like", existingLike, fetchError);

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
        } else {
          console.error("Error fetching like:", fetchError.message);
          throw fetchError;
        }
      }

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", id);

        if (deleteError) {
          console.error("Error removing like:", deleteError.message);
          throw deleteError;
        }

        return { liked: false };
      } else {
        const { data: newLike, error: insertError } = await supabase
          .from("likes")
          .insert([{ post_id: post.id, user_id: id }])
          .single();
        if (insertError) {
          console.error("Error adding like:", insertError.message);
          throw insertError;
        }

        return { liked: true, like: newLike };
      }
    } catch (error) {
      console.error("Unexpected error in toggleLike:", error);
      throw error;
    }
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
          onClick={toggleLike}
          className={`flex items-center gap-2 font-medium ${
            isLiked ? "text-pink-700" : "text-gray-500"
          }`}
        >
          <FaHeart />
          {post.likes.length}
        </button>
        <div>
          <button
            onClick={handleShareClick}
            className="font-semibold flex items-center gap-2 bg-gray-200 rounded-full px-4 py-1"
          >
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
