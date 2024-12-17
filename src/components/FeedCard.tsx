import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { RootState } from "../store";
import { RiSendPlaneFill } from "react-icons/ri";
import SharePopup from "./SharePopup";
import { PostWithRelations, User } from "../utils/types";
import { supabase } from "../supabase";
import { getPost, getUser } from "../utils";

export interface FeedCardProps {
  postId: string;
}

const FeedCard = ({ postId }: FeedCardProps) => {
  const [postUser, setPostUser] = useState<User | undefined>();
  const [post, setPost] = useState<PostWithRelations | undefined>();
  const { id } = useSelector((state: RootState) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch user and post information
  useEffect(() => {
    if (!post?.user_id || postUser) return;
    (async () => {
      const user = await getUser(post?.user_id);
      setPostUser(user);
    })();
  }, [post?.user_id, postUser]);

  const fetchPost = useCallback(async () => {
    setPost(await getPost(postId));
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    fetchPost();
  }, [postId, fetchPost]);

  // Calculate the time ago for the post
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
    if (!post?.created_at) return;
    setTimeAgo(calculateTimeAgo(post?.created_at));

    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(post?.created_at));
    }, 60000);

    return () => clearInterval(interval);
  }, [post?.created_at]);

  // IntersectionObserver to handle video autoplay and pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => {
            console.error("Error playing video:", error);
          });
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

  // Like toggle functionality
  const toggleLike = async () => {
    try {
      const { data: existingLike, error: fetchError } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", post?.id)
        .eq("user_id", id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error(fetchError.message);
      }

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post?.id)
          .eq("user_id", id);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from("likes")
          .insert([{ post_id: post?.id, user_id: id }])
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }
      }
      fetchPost();
    } catch (error) {
      console.error("Unexpected error in toggleLike:", error);
    }
  };

  // Share functionality
  const handleShareClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Open video modal for fullscreen video playback
  const openVideoModal = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl(null);
  };

  // Function to handle Show More/Show Less
  const handleShowMoreClick = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  // Function to format text with hashtag color
  const formatTextWithHashtags = (text: string) => {
    const regex = /#(\w+)/g;
    return text.split(regex).map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="text-blue-500">
            #{part}
          </span>
        );
      }
      return part;
    });
  };

  const url = window.location.href;

  return (
    <div className="w-full h-auto bg-purple-50 shadow hover:shadow-xl border flex flex-col justify-between rounded-lg p-4 transition-all duration-300">
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

      {/* Text and Show More button in the same row */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <small
            className={`text-ellipsis flex-1 ${
              isTextExpanded ? "overflow-visible" : "overflow-hidden"
            }`}
            style={{ maxHeight: isTextExpanded ? "none" : "60px" }} // Adjust max height based on expanded/collapsed state
          >
            {post?.text && (
              <span>
                {formatTextWithHashtags(
                  post.text.slice(0, isTextExpanded ? undefined : 100)
                )}
              </span>
            )}
          </small>

          {/* Show More Button */}
          {post?.text && post.text.length > 100 && (
            <button
              onClick={handleShowMoreClick}
              className="text-blue-500 font-semibold"
            >
              {isTextExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>

      <div
        className={`overflow-x-auto flex w-full h-[167px] ${
          post?.post_images && post?.post_images.length === 1
            ? "justify-center"
            : "gap-x-4"
        }`}
      >
        {post?.post_images?.map((img, idx) => (
          <img
            key={idx}
            src={img.image_url ?? undefined}
            alt=""
            className={`${
              post?.post_images.length === 1 ? "w-full" : "w-max"
            } object-cover rounded-lg`}
          />
        ))}
        {post?.video_url && (
          <video
            ref={videoRef}
            src={post?.video_url}
            className="object-cover w-full rounded-lg shadow-xl h-full"
            controls={false}
            onClick={() => openVideoModal(post.video_url as string)}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={toggleLike}
          className="flex items-center gap-2 font-medium"
        >
          <span
            className={`${
              post?.likes?.find((user) => user.user_id === id)
                ? "text-pink-700"
                : "text-gray-500"
            }
            `}
          >
            <FaHeart />
          </span>
          {post?.likes.length}
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

      {/* Video Modal */}
      {isVideoModalOpen && currentVideoUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={closeVideoModal}
        >
          <video
            src={currentVideoUrl}
            className="max-w-4xl max-h-[80vh] object-cover"
            controls
            autoPlay
          />
        </div>
      )}
    </div>
  );
};

export default FeedCard;
