import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaFacebookMessenger,
  FaDiscord,
} from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

// Define types for the component props
interface SharePopupProps {
  url: string; // The URL to share
  onClose: () => void; // Function to close the popup
}

const SharePopup: React.FC<SharePopupProps> = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Copy URL to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Social share handling, restricting `platform` to known values
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
        // Instagram doesn't have a direct sharing link, so you can guide users to use the Instagram app manually.
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

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Share this post</h3>
        <div className="flex justify-around mb-4">
          {/* Social Media Share Buttons */}
          <button
            onClick={() => handleSocialShare("facebook")}
            className="text-blue-600 font-medium p-2 hover:bg-blue-100 rounded-full">
            <FaFacebook size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("twitter")}
            className="text-blue-400 font-medium p-2 hover:bg-blue-100 rounded-full">
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("whatsapp")}
            className="text-green-500 font-medium p-2 hover:bg-green-100 rounded-full">
            <FaWhatsapp size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("messenger")}
            className="text-blue-500 font-medium p-2 hover:bg-blue-100 rounded-full">
            <FaFacebookMessenger size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("instagram")}
            className="text-gradient font-medium p-2 hover:bg-gradient-to-r rounded-full">
            <RiInstagramFill size={24} />
          </button>
          <button
            onClick={() => handleSocialShare("discord")}
            className="text-[#5865F2] font-medium p-2 hover:bg-[#5865F2]/10 rounded-full">
            <FaDiscord size={24} />
          </button>
        </div>

        {/* Copy URL Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleCopy}
            className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
