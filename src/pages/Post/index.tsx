import React, { FC, useState, ChangeEvent } from "react";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { withDefaultLayout } from "../../hoc/withDefaulLayout";

const Post: FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [caption, setCaption] = useState<string>("");

  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageURL = URL.createObjectURL(file);
      newImages.push(imageURL);
    }

    setImages((prev) => [...prev, ...newImages]);
    if (images.length === 0 && newImages.length > 0) {
      setCurrentIndex(0);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      images.length > 0 ? (prev + 1) % images.length : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      images.length > 0 ? (prev - 1 + images.length) % images.length : 0
    );
  };

  const handleDeleteCurrentImage = () => {
    if (images.length > 0) {
      const updated = [...images];
      updated.splice(currentIndex, 1);
      setImages(updated);
      setCurrentIndex((prev) =>
        prev >= updated.length ? updated.length - 1 : prev
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-[350px] bg-white rounded-md shadow-md">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <button className="mr-2 text-gray-600 hover:text-gray-800">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="font-medium text-lg text-gray-900">New post</h1>
        </div>

        {/* Image Display Section */}
        {images.length > 0 && (
          <div className="relative p-4 flex flex-col items-center">
            <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
              {/* Image */}
              <img
                src={images[currentIndex]}
                alt={`Selected ${currentIndex + 1}`}
                className="object-cover w-full h-full"
              />

              {/* Image count indicator */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentIndex + 1}/{images.length}
              </div>

              {/* Delete button */}
              <button
                onClick={handleDeleteCurrentImage}
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow text-gray-700 hover:text-red-500"
              >
                <TrashIcon className="w-4 h-4" />
              </button>

              {/* Navigation arrows if more than one image */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 p-1 rounded-full shadow"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 p-1 rounded-full shadow"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Add More Photos Section */}
        <div className="px-4 py-2">
          <div className="flex items-center mb-4">
            <label className="flex items-center text-gray-700 cursor-pointer">
              <span className="mr-2">📂</span>
              <span className="underline">Add more Photos</span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleAddImages}
              />
            </label>
          </div>
        </div>

        {/* Caption Textarea */}
        <div className="px-4 pb-4">
          <textarea
            placeholder="Surrounded by nature’s beauty, finding peace in every leaf, breeze, and sunset. 🌿🌍
#NatureVibes #OutdoorEscape #EarthLover"
            className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            value={caption}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setCaption(e.target.value)
            }
          />
        </div>

        {/* Create Button */}
        <div className="border-t border-gray-200 p-4">
          <button className="w-full bg-black text-white py-2 rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black">
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default withDefaultLayout(Post);
