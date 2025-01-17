import React, { useRef, useState, useEffect } from "react";
import { withDefaultLayout } from "../../hoc/withDefaulLayout";

const Camera: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Open Camera Function
  const openCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        // Ensure video plays after the stream is set
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Failed to access camera.");
    }
  };

  // Close Camera Function
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
    setCapturedImage(null);
    setCapturedFile(null);
  };

  // Convert DataURL to File
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Capture Image from Video Feed
  const captureImage = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");

      // Update state with captured image preview
      setCapturedImage(imageDataUrl);

      // Convert dataURL to file
      const file = dataURLtoFile(imageDataUrl, "captured_image.png");
      setCapturedFile(file);
    }
  };

  // Effect to check video width/height after stream is available
  useEffect(() => {
    if (
      videoRef.current &&
      videoRef.current.videoWidth &&
      videoRef.current.videoHeight
    ) {
      console.log(
        "Video dimensions:",
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center gap-4 border p-4 rounded-md max-w-sm mx-auto mt-10">
      {/* Open Camera Button */}
      {!isCameraOpen && !capturedImage && (
        <button
          className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100"
          onClick={openCamera}
        >
          Open Camera
        </button>
      )}

      {/* Camera is open and no image captured yet */}
      {isCameraOpen && !capturedImage && (
        <div className="w-full">
          <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              className="object-cover w-full h-full"
              playsInline
              autoPlay
              muted
              onLoadedMetadata={() => {
                console.log("Video metadata loaded");
              }}
            />
          </div>

          <div className="flex justify-around mt-2">
            <button
              className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100"
              onClick={captureImage}
            >
              Capture
            </button>

            <button
              className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100"
              onClick={closeCamera}
            >
              Close Camera
            </button>
          </div>
        </div>
      )}

      {/* Image captured and preview shown */}
      {capturedImage && (
        <div className="w-full">
          <div className="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="object-cover w-full h-full"
            />
          </div>
          <p className="mt-2 text-center text-gray-600 text-sm">
            Image captured successfully!
          </p>
          {capturedFile && (
            <p className="mt-2 text-center text-gray-600 text-sm">
              Stored as file: {capturedFile.name}, size: {capturedFile.size}{" "}
              bytes
            </p>
          )}

          <div className="flex justify-center mt-4">
            <button
              className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100"
              onClick={closeCamera}
            >
              Retake / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withDefaultLayout(Camera);
