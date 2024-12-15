import React, { useRef, useState, useEffect } from "react";

interface CameraComponentProps {
  onCapture?: (imageDataUrl: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openCamera = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

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
      setCapturedImage(imageDataUrl);

      // Pass the captured image back to the parent if a callback is provided
      if (onCapture) {
        onCapture(imageDataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 border p-4 rounded-md">
      {!isCameraOpen && (
        <button
          className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100"
          onClick={openCamera}
        >
          Open Camera
        </button>
      )}

      {isCameraOpen && (
        <div className="w-full">
          <div className="relative w-full max-w-full h-48 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              className="object-cover w-full h-full"
              playsInline
              autoPlay
              muted
            />
            {capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="max-h-full max-w-full"
                />
              </div>
            )}
          </div>

          <div className="flex justify-around mt-2">
            {!capturedImage && (
              <button
                className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100"
                onClick={captureImage}
              >
                Capture
              </button>
            )}

            <button
              className="border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100"
              onClick={closeCamera}
            >
              Close Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
