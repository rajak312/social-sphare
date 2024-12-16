import React, { FC, useState, ChangeEvent, useEffect } from "react";
import { withDefaultLayout } from "../../hoc/withDefaulLayout";
import Bin from "../../assets/bin.svg";
import Gallary from "../../assets/gallery.svg";
import Camera from "../../assets/camera-svgrepo.svg";
import VideoIcon from "../../assets/video-library-svgrepo-com 1.svg";
import { BackButton } from "../../components/BackButton";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { uploadFile } from "../../utils";

const Post: FC = () => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [video, setVideo] = useState<{ file: File; preview: string } | null>(
    null
  );
  const [caption, setCaption] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const userStore = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: { file: File; preview: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageURL = URL.createObjectURL(file);
      newImages.push({ file, preview: imageURL });
    }

    setImages((prev) => [...prev, ...newImages]);
    setVideo(null);
  };

  const handleAddVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const videoURL = URL.createObjectURL(file);

    setImages([]);
    setVideo({ file, preview: videoURL });
  };

  const [currentIndex, setCurrentIndex] = useState<number>(0);

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
      URL.revokeObjectURL(updated[currentIndex].preview);
      updated.splice(currentIndex, 1);
      setImages(updated);
      setCurrentIndex((prev) =>
        prev >= updated.length ? updated.length - 1 : prev
      );
    }
  };

  const handleDeleteVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.preview);
      setVideo(null);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      let video_url: string | null = "";
      if (video) {
        video_url = await uploadFile(video.file);
      }
      const { data: insertedPosts, error: postError } = await supabase
        .from("posts")
        .insert({
          text: caption,
          user_id: userStore.id,
          video_url,
        })
        .select();

      if (postError || !insertedPosts?.[0]) {
        throw postError || new Error("No post returned after insert.");
      }

      const newPost = insertedPosts[0];

      if (images.length > 0) {
        const imageData = await Promise.all(
          images.map(async (img) => ({
            post_id: newPost.id,
            image_url: await uploadFile(img.file),
          }))
        );
        const { error: imageError } = await supabase
          .from("post_images")
          .insert(imageData);
        if (imageError) {
          throw imageError;
        }
      }
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
      if (video) URL.revokeObjectURL(video.preview);
    };
  }, [images, video]);

  const renderImages = () =>
    images.length > 0 && (
      <div className="relative flex flex-col items-center">
        <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          <img
            src={images[currentIndex].preview}
            alt={`Selected ${currentIndex + 1}`}
            className="object-cover w-full rounded-lg shadow-xl h-full"
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1}/{images.length}
          </div>
          <button
            onClick={handleDeleteCurrentImage}
            className="absolute bottom-2 right-2"
          >
            <img src={Bin} alt="Delete" />
          </button>
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
    );

  const renderVideo = () =>
    video && (
      <div className="relative flex flex-col items-center">
        <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          <video
            src={video.preview}
            controls
            className="object-cover w-full rounded-lg shadow-xl h-full"
          />
          <button
            onClick={handleDeleteVideo}
            className="absolute bottom-2 right-2"
          >
            <img src={Bin} alt="Delete" />
          </button>
        </div>
      </div>
    );

  const renderMediaPreview = () =>
    images.length > 0 ? renderImages() : renderVideo();

  const renderOptions = () =>
    images.length === 0 &&
    !video && (
      <>
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <img src={Gallary} alt="Add Photos" />
            <span className="font-bold">Photos</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleAddImages}
              accept="image/*"
            />
          </label>
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <img src={VideoIcon} alt="Add Video" />
            <span className="font-bold">Video</span>
            <input
              type="file"
              className="hidden"
              onChange={handleAddVideo}
              accept="video/*"
            />
          </label>
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <img src={Camera} alt="Add Camera Photo" />
            <span className="font-bold">Camera</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleAddImages}
              accept="image/*"
            />
          </label>
        </div>
      </>
    );

  return (
    <div className="bg-white p-4 h-full">
      <div className="h-[80%]">
        <BackButton onBack={handleBack} title="New Post" />
        <div className="flex flex-col p-6 justify-between h-full">
          <div className="flex flex-col gap-4">
            {renderMediaPreview()}
            {images.length > 0 && (
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <img src={Gallary} alt="Add Gallery" />
                  <span className="font-bold">Add more Photos</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAddImages}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
            <textarea
              placeholder="Surrounded by nature’s beauty, finding peace in every leaf, breeze, and sunset. 🌿🌍 #NatureVibes #OutdoorEscape #EarthLover"
              className="w-full h-32 rounded resize-none p-2 border border-gray-300"
              value={caption}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setCaption(e.target.value)
              }
            />
            {renderOptions()}
          </div>
          <button
            className={`bg-black w-full p-2 rounded-full text-white font-semibold flex items-center justify-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleCreatePost}
            disabled={
              isLoading ||
              (caption.trim() === "" && images.length === 0 && !video)
            }
          >
            {isLoading ? "Creating..." : "CREATE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default withDefaultLayout(Post);
