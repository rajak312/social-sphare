import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

interface PostPops {
  post_images: { image_url: string }[];
  text: string;
  likes: any;
}

export const PostCard = ({ post_images, text, likes }: PostPops) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setCurrentImageIndex(swiper.realIndex);
  };

  return (
    <div className="relative w-full rounded-md overflow-hidden shadow-md bg-white">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        onSlideChange={handleSlideChange}
        className="w-full h-[240px] sm:h-[300px] md:h-[350px] object-cover"
      >
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
      {post_images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{post_images.length}
        </div>
      )}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
        <h6 className="font-medium text-sm truncate">{text}</h6>
        <div className="flex items-center gap-1 text-xs mt-1">
          <FaHeart className="text-red-500" />
          <span>{likes.length}</span>
        </div>
      </div>
    </div>
  );
};
