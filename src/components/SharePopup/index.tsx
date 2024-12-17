import React, { useState, useEffect, useRef } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaFacebookMessenger,
  FaDiscord,
} from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";

interface SharePopupProps {
  url: string;
  onClose: () => void;
}

export const SharePopup: React.FC<SharePopupProps> = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (
    platform:
      | "facebook"
      | "twitter"
      | "linkedin"
      | "whatsapp"
      | "messenger"
      | "instagram"
      | "discord"
  ) => {
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=Check this out!`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
        break;
      case "messenger":
        shareUrl = `https://www.messenger.com/share?link=${encodeURIComponent(
          url
        )}`;
        break;
      case "instagram":
        alert("Instagram sharing is not supported directly.");
        return;
      case "discord":
        shareUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(
          url
        )}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        backdropRef.current &&
        !backdropRef.current.contains(event.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn"
    >
      <div
        ref={popupRef}
        className="bg-white p-6 rounded-lg w-96 shadow-xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-semibold p-1 rounded-full transition-colors duration-300"
        >
          <FaTimes />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Share this post
        </h3>
        <div className="flex justify-around mb-4">
          <button
            onClick={() => handleSocialShare("facebook")}
            className="text-blue-600 font-medium p-2 hover:bg-blue-100 rounded-full transition-colors duration-300"
          >
            <FaFacebook size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("twitter")}
            className="text-blue-400 font-medium p-2 hover:bg-blue-100 rounded-full transition-colors duration-300"
          >
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("whatsapp")}
            className="text-green-500 font-medium p-2 hover:bg-green-100 rounded-full transition-colors duration-300"
          >
            <FaWhatsapp size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("messenger")}
            className="text-blue-500 font-medium p-2 hover:bg-blue-100 rounded-full transition-colors duration-300"
          >
            <FaFacebookMessenger size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("instagram")}
            className="text-gradient font-medium p-2 hover:bg-gradient-to-r rounded-full transition-all duration-300"
          >
            <RiInstagramFill size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("discord")}
            className="text-[#5865F2] font-medium p-2 hover:bg-[#5865F2]/10 rounded-full transition-colors duration-300"
          >
            <FaDiscord size={24} />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handleCopy}
            className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors duration-300"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
        </div>
      </div>
    </div>
  );
};
