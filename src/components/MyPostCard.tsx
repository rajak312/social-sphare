import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

interface PostPops {
  post_images: { image_url: string }[];
  text: string;
  likes: any;
}

const MyPostCard = ({ post_images, text, likes }: PostPops) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setCurrentImageIndex(swiper.realIndex);
  };

  return (
    <div className="w-full h-full min-h-max max-h-min bg-white border shadow-xl overflow-hidden rounded-xl relative">
      {post_images.length > 1 && ( // Only show the count if there are multiple images
        <div className="absolute z-50 top-4 right-0 transform -translate-x-1/2 text-white font-bold bg-black bg-opacity-50 px-2 rounded-md">
          <small>
            {currentImageIndex + 1} / {post_images.length}
          </small>
        </div>
      )}

      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        onSlideChange={handleSlideChange}>
        {post_images.map((item, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={item.image_url}
              alt={`Post Image ${idx}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute z-50 bottom-4 left-2">
        <h6 className="text-white font-bold">{text}</h6>
        <div className="flex text-gray-500 font-medium items-center gap-2">
          <FaHeart />
          {likes.length}
        </div>
      </div>
    </div>
  );
};

export default MyPostCard;
