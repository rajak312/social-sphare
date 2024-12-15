import React, { FC, useState, ChangeEvent } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { withDefaultLayout } from "../../hoc/withDefaulLayout";
import Bin from "../../assets/bin.svg";
import Gallary from "../../assets/gallery.svg";
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
    <div className="bg-white h-full">
      <div className="h-[80%]">
        <div className="flex items-center p-4 ">
          <button className="mr-2 text-gray-600 hover:text-gray-800">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="font-medium text-lg text-gray-900">New post</h1>
        </div>

        <div className="flex flex-col  p-6 justify-between h-full ">
          <div className="flex flex-col gap-4">
            <div>
              {images.length > 0 && (
                <div className="relative  flex flex-col items-center">
                  <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={images[currentIndex]}
                      alt={`Selected ${currentIndex + 1}`}
                      className="object-cover w-full rounded-lg shadow-xl h-full"
                    />

                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {currentIndex + 1}/{images.length}
                    </div>

                    <button
                      onClick={handleDeleteCurrentImage}
                      className="absolute bottom-2 right-2">
                      <img src={Bin} alt="" />
                    </button>

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 p-1 rounded-full shadow">
                          ‹
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-900 p-1 rounded-full shadow">
                          ›
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <img src={Gallary} alt="" />
                <span className="font-bold">Add more Photos</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAddImages}
                />
              </label>
            </div>

            <textarea
              placeholder="Surrounded by nature’s beauty, finding peace in every leaf, breeze, and sunset. 🌿🌍 #NatureVibes #OutdoorEscape #EarthLover"
              className="w-full h-32 rounded resize-none"
              value={caption}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setCaption(e.target.value)
              }
            />
          </div>

          <button className=" bg-black w-full p-2 rounded-full text-white font-semibold">
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default withDefaultLayout(Post);
