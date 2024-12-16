import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { RootState } from "../store";
import { RiSendPlaneFill } from "react-icons/ri";
import SharePopup from "./SharePopup";
import { PostWithRelations, User } from "../utils/types";
import { supabase } from "../supabase";
import { getUser } from "../utils";

export interface FeedCardProps {
  post: PostWithRelations;
  refetch?: () => void;
}

const FeedCard = ({ post, refetch }: FeedCardProps) => {
  const [postUser, setPostUser] = useState<User | undefined>();
  const { id } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser(post.user_id);
      setPostUser(user);
    })();
  }, [post.user_id]);

  const calculateTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor(
      (now.getTime() - postTime.getTime()) / 1000
    );

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `Just now`;
  };

  useEffect(() => {
    setTimeAgo(calculateTimeAgo(post.created_at));

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(post.created_at));
    }, 60000);

    return () => clearInterval(interval);
  }, [post.created_at]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoRef]);

  const toggleLike = async () => {
    try {
      const { data: existingLike, error: fetchError } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(fetchError.message);
      }

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", id);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from("likes")
          .insert([{ post_id: post.id, user_id: id }])
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }
      }
      refetch?.();
    } catch (error) {
      console.error("Unexpected error in toggleLike:", error);
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
          src={postUser?.profile_picture_url ?? undefined}
          alt=""
          className="w-10 h-10 object-cover rounded-full"
        />
        <div>
          <h6 className="font-semibold">{postUser?.display_name}</h6>
          <small>{timeAgo}</small>
        </div>
      </div>
      <small className="text-ellipsis line-clamp-3">{post.text}</small>
      <div
        className={`overflow-x-auto flex w-full h-[167px] ${
          post.post_images && post.post_images.length === 1
            ? "justify-center"
            : "gap-x-4"
        }`}
      >
        {post.post_images?.map((img, idx) => (
          <img
            key={idx}
            src={img.image_url ?? undefined}
            alt=""
            className={`${
              post.post_images.length === 1 ? "w-full" : "w-max"
            } object-cover rounded-lg`}
          />
        ))}
        {post.video_url && (
          <video
            ref={videoRef}
            src={post.video_url}
            className="object-cover w-full rounded-lg shadow-xl h-full"
            controls={false}
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 font-medium ${
            post.likes?.find((user) => user.id === id)
              ? "text-pink-700"
              : "text-gray-500"
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
